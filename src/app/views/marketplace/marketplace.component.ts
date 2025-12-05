import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  FormModule,
  GridModule,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  RowComponent,
  ColComponent,
  InputGroupComponent,
  InputGroupTextDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { ProjectService } from '../../core/services/project.service';
import type { Provider, Resource } from '../../core/models/project.models';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    ButtonDirective,
    GridModule,
    RowComponent,
    ColComponent,
    FormModule,
    BadgeComponent,
    AvatarComponent,
    ModalModule,
    ButtonCloseDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    IconDirective,
    InputGroupComponent,
    InputGroupTextDirective
  ],
  templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly marketplaceService = inject(MarketplaceService);
  private readonly projectService = inject(ProjectService);

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string | null>(null);
  readonly showResourceModal = signal(false);
  readonly selectedActionId = signal<string | null>(null);
  readonly selectedProjectId = signal<string | null>(null);
  readonly connectProviderId = signal<string | null>(null);
  readonly showConnectModal = signal(false);

  readonly resourceForm = this.fb.group({
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    company: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['']
  });

  readonly filteredProviders = computed<Provider[]>(() => {
    const query = this.searchQuery();
    const category = this.selectedCategory();

    if (query.trim()) {
      return this.marketplaceService.searchProviders(query, category);
    }

    return this.marketplaceService.getProvidersByCategory(category);
  });

  readonly availableCategories = computed<string[]>(() => {
    const providers = this.marketplaceService.providers();
    const categories = new Set<string>();
    providers.forEach((provider: Provider) => {
      provider.categories.forEach((cat: string) => categories.add(cat));
    });
    return Array.from(categories).sort();
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const category = params['category'] as string | undefined;
      const actionId = params['actionId'] as string | undefined;
      const projectId = params['projectId'] as string | undefined;

      if (category) {
        this.selectedCategory.set(category);
      }
      if (actionId) {
        this.selectedActionId.set(actionId);
      }
      if (projectId) {
        this.selectedProjectId.set(projectId);
      }
    });
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onCategoryChange(category: string | null): void {
    this.selectedCategory.set(category);
    this.updateQueryParams();
  }

  toggleResourceModal(): void {
    this.showResourceModal.update(val => !val);
  }

  handleResourceModalChange(event: boolean): void {
    this.showResourceModal.set(event);
  }

  addResource(): void {
    if (this.resourceForm.valid) {
      const actionId = this.selectedActionId();
      const projectId = this.selectedProjectId();

      if (actionId && projectId) {
        const resource: Resource = {
          id: Date.now().toString(),
          fullName: this.resourceForm.value.fullName ?? '',
          role: this.resourceForm.value.role ?? '',
          company: this.resourceForm.value.company || undefined,
          email: this.resourceForm.value.email ?? '',
          phone: this.resourceForm.value.phone || undefined
        };

        this.projectService.assignResourceToAction(projectId, actionId, resource);
      }

      this.showResourceModal.set(false);
      this.resourceForm.reset();

      // Navigate back to project detail if we came from there
      if (projectId) {
        this.router.navigate(['/projects', projectId]);
      }
    }
  }

  openConnectModal(providerId: string): void {
    this.connectProviderId.set(providerId);
    this.showConnectModal.set(true);
  }

  getProviderById(providerId: string | null): Provider | undefined {
    return providerId ? this.marketplaceService.getProviderById(providerId) : undefined;
  }

  closeConnectModal(): void {
    this.showConnectModal.set(false);
    this.connectProviderId.set(null);
  }

  connectProvider(): void {
    const providerId = this.connectProviderId();
    const actionId = this.selectedActionId();
    const projectId = this.selectedProjectId();

    if (providerId && actionId && projectId) {
      const provider = this.marketplaceService.getProviderById(providerId);
      if (provider) {
        const resource: Resource = {
          id: provider.id,
          fullName: provider.name,
          role: provider.type,
          company: provider.type === 'Agency' ? provider.name : undefined,
          email: provider.email || '',
          phone: provider.phone || undefined
        };

        this.projectService.assignResourceToAction(projectId, actionId, resource);
        this.closeConnectModal();

        // Navigate back to project detail if we came from there
        if (projectId) {
          this.router.navigate(['/projects', projectId]);
        }
      }
    }
  }

  private updateQueryParams(): void {
    const queryParams: Record<string, string | null> = {};
    const category = this.selectedCategory();
    const actionId = this.selectedActionId();
    const projectId = this.selectedProjectId();

    if (category) {
      queryParams['category'] = category;
    }
    if (actionId) {
      queryParams['actionId'] = actionId;
    }
    if (projectId) {
      queryParams['projectId'] = projectId;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
}
