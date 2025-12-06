import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TableDirective,
  WidgetStatBComponent,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ProgressComponent,
    TableDirective,
    RouterLink,
    WidgetStatBComponent,
    BadgeComponent
  ]
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly analyticsService = inject(AnalyticsService);

  readonly userRole = computed(() => this.authService.userRole());
  readonly isSuperAdmin = computed(() => this.userRole() === UserRole.SUPER_ADMIN);

  // For non-Super Admin users
  readonly projects = this.projectService.activeProjects;
  readonly projectsCount = this.projectService.projectsCount;
  readonly pendingActionsCount = this.projectService.pendingActionsCount;

  // For Super Admin
  readonly analytics = this.analyticsService.analytics;

  ngOnInit(): void {
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'In Progress': 'info',
      'Action Required': 'warning',
      'Under Review': 'success',
      'Completed': 'secondary',
      'Draft': 'secondary'
    };
    return colorMap[status] ?? 'secondary';
  }
}
