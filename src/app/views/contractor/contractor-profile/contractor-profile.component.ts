import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  FormModule,
  ButtonDirective,
  RowComponent,
  ColComponent,
  AlertComponent,
  AlertModule,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ContractorProfile, ClientTestimonial, RecentWork, PortfolioItem } from '../../../core/models/user.model';

@Component({
  selector: 'app-contractor-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    FormModule,
    ButtonDirective,
    RowComponent,
    ColComponent,
    AlertComponent,
    AlertModule,
    BadgeComponent,
    IconDirective
  ],
  templateUrl: './contractor-profile.component.html',
  styleUrls: ['./contractor-profile.component.scss']
})
export class ContractorProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  profileForm = this.fb.group({
    useCases: this.fb.array<string>([]),
    clientTestimonials: this.fb.array<ClientTestimonial>([]),
    recentWork: this.fb.array<RecentWork>([]),
    portfolio: this.fb.array<PortfolioItem>([])
  });

  readonly currentUser = computed(() => this.authService.currentUser());

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const user = this.currentUser();
    if (user?.contractorProfile) {
      const profile = user.contractorProfile;
      
      // Load use cases
      if (profile.useCases) {
        profile.useCases.forEach(uc => this.addUseCase(uc));
      }
      
      // Load testimonials
      if (profile.clientTestimonials) {
        profile.clientTestimonials.forEach(testimonial => this.addTestimonial(testimonial));
      }
      
      // Load recent work
      if (profile.recentWork) {
        profile.recentWork.forEach(work => this.addRecentWork(work));
      }
      
      // Load portfolio
      if (profile.portfolio) {
        profile.portfolio.forEach(item => this.addPortfolioItem(item));
      }
    }
  }

  // Use Cases
  get useCasesFormArray(): FormArray {
    return this.profileForm.get('useCases') as FormArray;
  }

  addUseCase(value: string = ''): void {
    this.useCasesFormArray.push(this.fb.control(value, Validators.required));
  }

  removeUseCase(index: number): void {
    this.useCasesFormArray.removeAt(index);
  }

  // Testimonials
  get testimonialsFormArray(): FormArray {
    return this.profileForm.get('clientTestimonials') as FormArray;
  }

  addTestimonial(testimonial?: ClientTestimonial): void {
    const testimonialGroup = this.fb.group({
      id: [testimonial?.id || this.generateId()],
      clientName: [testimonial?.clientName || '', Validators.required],
      clientCompany: [testimonial?.clientCompany || ''],
      testimonial: [testimonial?.testimonial || '', Validators.required],
      rating: [testimonial?.rating || 5, [Validators.required, Validators.min(1), Validators.max(5)]],
      date: [testimonial?.date || new Date()]
    });
    this.testimonialsFormArray.push(testimonialGroup);
  }

  removeTestimonial(index: number): void {
    this.testimonialsFormArray.removeAt(index);
  }

  // Recent Work
  get recentWorkFormArray(): FormArray {
    return this.profileForm.get('recentWork') as FormArray;
  }

  addRecentWork(work?: RecentWork): void {
    const workGroup = this.fb.group({
      id: [work?.id || this.generateId()],
      title: [work?.title || '', Validators.required],
      description: [work?.description || '', Validators.required],
      clientName: [work?.clientName || ''],
      completedDate: [work?.completedDate || new Date()],
      category: [work?.category || '']
    });
    this.recentWorkFormArray.push(workGroup);
  }

  removeRecentWork(index: number): void {
    this.recentWorkFormArray.removeAt(index);
  }

  // Portfolio
  get portfolioFormArray(): FormArray {
    return this.profileForm.get('portfolio') as FormArray;
  }

  addPortfolioItem(item?: PortfolioItem): void {
    const itemGroup = this.fb.group({
      id: [item?.id || this.generateId()],
      title: [item?.title || '', Validators.required],
      description: [item?.description || '', Validators.required],
      imageUrl: [item?.imageUrl || ''],
      link: [item?.link || ''],
      category: [item?.category || ''],
      tags: this.fb.array<string>(item?.tags || [])
    });
    this.portfolioFormArray.push(itemGroup);
  }

  removePortfolioItem(index: number): void {
    this.portfolioFormArray.removeAt(index);
  }

  addPortfolioTag(portfolioIndex: number, tag: string = ''): void {
    if (!tag || !tag.trim()) return;
    const portfolioItem = this.portfolioFormArray.at(portfolioIndex);
    if (portfolioItem) {
      const tagsArray = portfolioItem.get('tags') as FormArray;
      if (tagsArray) {
        tagsArray.push(this.fb.control(tag.trim()));
      }
    }
  }

  removePortfolioTag(portfolioIndex: number, tagIndex: number): void {
    const portfolioItem = this.portfolioFormArray.at(portfolioIndex);
    if (portfolioItem) {
      const tagsArray = portfolioItem.get('tags') as FormArray;
      if (tagsArray) {
        tagsArray.removeAt(tagIndex);
      }
    }
  }

  getPortfolioTags(portfolioIndex: number): FormArray {
    const portfolioItem = this.portfolioFormArray.at(portfolioIndex);
    return portfolioItem?.get('tags') as FormArray;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const user = this.currentUser();
    if (!user) {
      this.errorMessage.set('User not found');
      this.isLoading.set(false);
      return;
    }

    const formValue = this.profileForm.value;
    const contractorProfile: ContractorProfile = {
      useCases: formValue.useCases?.filter((uc): uc is string => !!uc && !!uc.trim()) || [],
      clientTestimonials: formValue.clientTestimonials?.filter((t): t is NonNullable<typeof t> => !!t).map(t => ({
        id: t.id || this.generateId(),
        clientName: t.clientName || '',
        clientCompany: t.clientCompany,
        testimonial: t.testimonial || '',
        rating: t.rating || 5,
        date: t.date ? new Date(t.date) : new Date()
      })) || [],
      recentWork: formValue.recentWork?.filter((w): w is NonNullable<typeof w> => !!w).map(w => ({
        id: w.id || this.generateId(),
        title: w.title || '',
        description: w.description || '',
        clientName: w.clientName,
        completedDate: w.completedDate ? new Date(w.completedDate) : new Date(),
        category: w.category
      })) || [],
      portfolio: formValue.portfolio?.filter((p): p is NonNullable<typeof p> => !!p).map(p => ({
        id: p.id || this.generateId(),
        title: p.title || '',
        description: p.description || '',
        imageUrl: p.imageUrl,
        link: p.link,
        category: p.category,
        tags: p.tags?.filter((t): t is string => !!t && !!t.trim()) || []
      })) || []
    };

    this.userService.updateUser(user.id, { contractorProfile }).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully!');
        this.isLoading.set(false);
        setTimeout(() => {
          this.successMessage.set(null);
        }, 3000);
      },
      error: (error: Error) => {
        this.errorMessage.set(error.message || 'Failed to update profile');
        this.isLoading.set(false);
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          if (group instanceof FormArray) {
            const subArray = group as FormArray;
            subArray.controls.forEach(subGroup => {
              if (subGroup instanceof FormArray) {
                const subSubArray = subGroup as FormArray;
                subSubArray.controls.forEach(subControl => {
                  subControl.markAsTouched();
                });
              } else {
                subGroup.markAsTouched();
              }
            });
          } else if (group instanceof FormControl) {
            group.markAsTouched();
          } else {
            Object.keys((group as any).controls || {}).forEach((subKey: string) => {
              (group as any).get(subKey)?.markAsTouched();
            });
          }
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

