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
      const contractor = this.marketplaceService.getProviderById(id);
      this.contractor.set(contractor);
      
      // Also check if this is a contractor user
      const contractorUser = this.userService.getUserById(id);
      if (contractorUser && contractorUser.role === UserRole.CONTRACTOR) {
        this.contractorUser.set(contractorUser);
      }
      
      if (!contractor && !contractorUser) {
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

