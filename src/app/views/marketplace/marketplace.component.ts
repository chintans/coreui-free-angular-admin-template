import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonCloseDirective,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
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
  InputGroupTextDirective,
  TableDirective,
  WidgetStatBComponent,
  ProgressComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarketplaceService } from '../../core/services/marketplace.service';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import type { Provider } from '../../core/models/project.models';
import { UserRole } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    RowComponent,
    ColComponent,
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
    InputGroupTextDirective,
    TableDirective,
    WidgetStatBComponent,
    ProgressComponent
  ],
  templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly marketplaceService = inject(MarketplaceService);
  private readonly authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly userService = inject(UserService);

  readonly userRole = computed(() => this.authService.userRole());
  readonly isSuperAdmin = computed(() => this.userRole() === UserRole.SUPER_ADMIN);
  readonly analytics = this.analyticsService.analytics;

  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string | null>(null);
  readonly selectedActionId = signal<string | null>(null);
  readonly selectedProjectId = signal<string | null>(null);
  
  // Super Admin contractor management
  readonly showDeleteConfirm = signal(false);
  readonly deletingContractorId = signal<string | null>(null);

  readonly filteredProviders = computed<Provider[]>(() => {
    const query = this.searchQuery();
    const category = this.selectedCategory();

    if (query.trim()) {
      return this.marketplaceService.searchProviders(query, category);
    }

    return this.marketplaceService.getProvidersByCategory(category);
  });

  readonly contractors = computed(() => this.userService.contractors());

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

  // Super Admin contractor management methods
  navigateToAddContractor(): void {
    console.log('[Marketplace] Navigating to add contractor');
    const targetUrl = '/marketplace/contractors/new';
    console.log('[Marketplace] Target URL:', targetUrl);
    console.log('[Marketplace] Current URL:', this.router.url);
    
    this.router.navigateByUrl(targetUrl)
      .then((success) => {
        console.log('[Marketplace] Navigation successful:', success);
      })
      .catch((error) => {
        console.error('[Marketplace] Navigation failed:', error);
        console.error('[Marketplace] Error details:', {
          name: error?.name,
          message: error?.message,
          stack: error?.stack
        });
      });
  }

  confirmDelete(providerId: string): void {
    this.deletingContractorId.set(providerId);
    this.showDeleteConfirm.set(true);
  }

  deleteContractor(): void {
    const id = this.deletingContractorId();
    if (id) {
      this.marketplaceService.deleteProvider(id);
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deletingContractorId.set(null);
  }
}
