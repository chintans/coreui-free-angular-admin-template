import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MarketplaceService } from '../../../core/services/marketplace.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import type { Provider } from '../../../core/models/project.models';
import { UserRole, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-contractor-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    BadgeComponent,
    AvatarComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './contractor-detail.component.html',
  styleUrls: ['./contractor-detail.component.scss']
})
export class ContractorDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly marketplaceService = inject(MarketplaceService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  readonly contractorId = signal<string | null>(null);
  readonly contractor = signal<Provider | undefined>(undefined);
  readonly contractorUser = signal<User | undefined>(undefined);
  readonly isSuperAdmin = computed(() => this.authService.userRole() === UserRole.SUPER_ADMIN);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.contractorId.set(id);
      
      // First check if this is a contractor user by ID
      let contractorUser = this.userService.getUserById(id);
      
      // If found as contractor user, set it and create a provider-like object for display
      if (contractorUser && contractorUser.role === UserRole.CONTRACTOR) {
        this.contractorUser.set(contractorUser);
        // Create a provider object from user data for consistent display
        const providerFromUser: Provider = {
          id: contractorUser.id,
          name: contractorUser.name,
          type: 'Independent',
          rating: 4.5,
          rate: '$120/hr',
          avatar: contractorUser.avatar,
          skills: contractorUser.contractorProfile?.useCases || [],
          categories: ['General'],
          email: contractorUser.email,
          description: 'Experienced contractor with expertise in multiple domains.'
        };
        this.contractor.set(providerFromUser);
      } else {
        // Check marketplace providers
        const contractor = this.marketplaceService.getProviderById(id);
        this.contractor.set(contractor);
        
        // Try to find matching contractor user by email or name
        if (contractor) {
          const allContractors = this.userService.contractors();
          contractorUser = allContractors.find(
            u => u.email === contractor.email || 
                 u.name.toLowerCase() === contractor.name.toLowerCase()
          );
          
          if (contractorUser && contractorUser.role === UserRole.CONTRACTOR) {
            this.contractorUser.set(contractorUser);
          }
        } else {
          // If no provider found, try to find contractor user by checking all contractors
          // This handles cases where viewing directly by user ID from users list
          const allContractors = this.userService.contractors();
          contractorUser = allContractors.find(u => u.id === id);
          
          if (contractorUser && contractorUser.role === UserRole.CONTRACTOR) {
            this.contractorUser.set(contractorUser);
            // Create a provider object from user data for consistent display
            const providerFromUser: Provider = {
              id: contractorUser.id,
              name: contractorUser.name,
              type: 'Independent',
              rating: 4.5,
              rate: '$120/hr',
              avatar: contractorUser.avatar,
              skills: contractorUser.contractorProfile?.useCases || [],
              categories: ['General'],
              email: contractorUser.email,
              description: 'Experienced contractor with expertise in multiple domains.'
            };
            this.contractor.set(providerFromUser);
          }
        }
      }
      
      if (!this.contractor() && !this.contractorUser()) {
        this.router.navigate(['/marketplace']);
      }
    });
  }

  onEdit(): void {
    const id = this.contractorId();
    if (id) {
      this.router.navigate(['/marketplace', 'contractors', id, 'edit']);
    }
  }

  onDelete(): void {
    const id = this.contractorId();
    if (id && confirm('Are you sure you want to delete this contractor? This action cannot be undone.')) {
      this.marketplaceService.deleteProvider(id);
      this.router.navigate(['/marketplace']);
    }
  }
}

