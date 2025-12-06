import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  BadgeComponent,
  RowComponent,
  ColComponent,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  TableDirective,
  TableModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { UserService } from '../../../core/services/user.service';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    BadgeComponent,
    RowComponent,
    ColComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    TableDirective,
    TableModule,
    IconDirective
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private readonly userService = inject(UserService);

  readonly allUsers = this.userService.users;
  searchQuery = signal<string>('');
  selectedRole = signal<UserRole | null>(null);

  filteredUsers = computed(() => {
    let users = this.allUsers();

    // Apply role filter
    if (this.selectedRole()) {
      users = users.filter(u => u.role === this.selectedRole());
    }

    // Apply search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      users = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );
    }

    return users;
  });

  userCounts = computed(() => {
    const users = this.allUsers();
    return {
      total: users.length,
      admins: users.filter(u => u.role === UserRole.SUPER_ADMIN).length,
      consultants: users.filter(u => u.role === UserRole.CONSULTANT).length,
      clients: users.filter(u => u.role === UserRole.CLIENT).length
    };
  });

  getRoleBadgeColor(role: UserRole): string {
    const colorMap: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'danger',
      [UserRole.CONSULTANT]: 'info',
      [UserRole.CLIENT]: 'success',
      [UserRole.CONTRACTOR]: 'warning'
    };
    return colorMap[role] ?? 'secondary';
  }

  getRoleLabel(role: UserRole): string {
    const labelMap: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.CONSULTANT]: 'Consultant',
      [UserRole.CLIENT]: 'Client',
      [UserRole.CONTRACTOR]: 'Contractor'
    };
    return labelMap[role] ?? role;
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onRoleFilterChange(role: UserRole | null): void {
    this.selectedRole.set(role);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedRole.set(null);
  }

  getAvatarUrl(avatar?: string): string {
    if (avatar) {
      return `/assets/images/avatars/${avatar}`;
    }
    return '/assets/images/avatars/0.jpg';
  }
}

