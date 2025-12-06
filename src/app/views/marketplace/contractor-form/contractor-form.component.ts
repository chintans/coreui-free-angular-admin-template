import { Component, computed, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  FormModule,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import type { Provider } from '../../../core/models/project.models';

@Component({
  selector: 'app-contractor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    FormModule,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss']
})
export class ContractorFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly marketplaceService = inject(MarketplaceService);
  private readonly authService = inject(AuthService);

  private paramsSubscription?: Subscription;

  readonly contractorId = signal<string | null>(null);
  readonly isEditMode = computed(() => this.contractorId() !== null);
  readonly isSuperAdmin = computed(() => this.authService.userRole() === UserRole.SUPER_ADMIN);

  readonly contractorForm = this.fb.group({
    name: ['', Validators.required],
    type: ['Agency', Validators.required],
    rating: [4.0, [Validators.required, Validators.min(0), Validators.max(5)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    description: [''],
    skills: [''],
    categories: ['']
  });

  ngOnInit(): void {
    // Route guard already handles authorization, so we can directly load data
    // For "new" route, don't do anything - just show empty form
    // Only process params for edit mode
    this.paramsSubscription = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && id !== 'new') {
        this.contractorId.set(id);
        const contractor = this.marketplaceService.getProviderById(id);
        if (contractor) {
          this.contractorForm.patchValue({
            name: contractor.name,
            type: contractor.type,
            rating: contractor.rating,
            email: contractor.email ?? '',
            phone: contractor.phone ?? '',
            description: contractor.description ?? '',
            skills: contractor.skills.join(', '),
            categories: contractor.categories.join(', ')
          });
          // Note: rate field is not displayed but preserved in the model
        } else {
          // Only navigate if contractor not found - suppress view transition errors
          try {
            this.router.navigate(['/marketplace']).catch((error) => {
              // Silently handle view transition errors
              if (error?.name !== 'DOMException' || !error?.message?.includes('ViewTransition')) {
                console.warn('Navigation error:', error);
              }
            });
          } catch (error) {
            if (error instanceof DOMException && error.message?.includes('ViewTransition')) {
              return;
            }
            throw error;
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
  }

  private navigateWithoutTransition(commands: any[]): void {
    // Suppress view transition errors
    try {
      this.router.navigate(commands).catch((error) => {
        // Silently handle view transition errors - they're non-critical
        if (error?.name !== 'DOMException' || !error?.message?.includes('ViewTransition')) {
          // Only log if it's not a view transition error
          console.warn('Navigation error:', error);
        }
      });
    } catch (error) {
      // Catch any synchronous errors
      if (error instanceof DOMException && error.message?.includes('ViewTransition')) {
        // Silently ignore view transition errors
        return;
      }
      throw error;
    }
  }

  onSubmit(): void {
    if (this.contractorForm.valid) {
      const formValue = this.contractorForm.value;
      const skills = formValue.skills?.split(',').map((s: string) => s.trim()).filter((s: string) => s) ?? [];
      const categories = formValue.categories?.split(',').map((c: string) => c.trim()).filter((c: string) => c) ?? [];

      if (this.isEditMode()) {
        const id = this.contractorId();
        if (id) {
          const existingContractor = this.marketplaceService.getProviderById(id);
          const contractorData: Partial<Provider> = {
            name: formValue.name ?? '',
            type: formValue.type as 'Agency' | 'Independent',
            rating: formValue.rating ?? 4.0,
            email: formValue.email ?? undefined,
            phone: formValue.phone || undefined,
            description: formValue.description || undefined,
            skills,
            categories
            // Note: rate is preserved from existing contractor
          };
          this.marketplaceService.updateProvider(id, contractorData);
          this.navigateWithoutTransition(['/marketplace', 'contractors', id]);
        }
      } else {
        const contractorData: Omit<Provider, 'id'> = {
          name: formValue.name ?? '',
          type: formValue.type as 'Agency' | 'Independent',
          rating: formValue.rating ?? 4.0,
          rate: '', // Rate field removed from UI but still required in model
          email: formValue.email ?? undefined,
          phone: formValue.phone || undefined,
          description: formValue.description || undefined,
          skills,
          categories
        };
        const newContractor = this.marketplaceService.addProvider(contractorData);
        this.navigateWithoutTransition(['/marketplace', 'contractors', newContractor.id]);
      }
    }
  }

  onCancel(): void {
    if (this.isEditMode()) {
      const id = this.contractorId();
      if (id) {
        this.navigateWithoutTransition(['/marketplace', 'contractors', id]);
      }
    } else {
      this.navigateWithoutTransition(['/marketplace']);
    }
  }
}


