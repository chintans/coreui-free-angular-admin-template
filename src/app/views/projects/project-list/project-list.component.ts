import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  BadgeComponent,
  ProgressComponent,
  RowComponent,
  ColComponent,
  TableDirective
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { Project } from '../../../core/models/project.models';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    BadgeComponent,
    ProgressComponent,
    RowComponent,
    ColComponent,
    IconDirective,
    TableDirective
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly userRole = computed(() => this.authService.userRole());
  readonly isSuperAdmin = computed(() => this.userRole() === UserRole.SUPER_ADMIN);
  readonly selectedConsultantId = signal<string | null>(null);

  readonly consultants = this.userService.consultants;
  
  readonly consultantProjectCounts = computed(() => {
    const counts = new Map<string, number>();
    this.consultants().forEach(consultant => {
      counts.set(consultant.id, this.projectService.getProjectsByConsultant(consultant.id).length);
    });
    return counts;
  });
  
  readonly filteredProjects = computed(() => {
    if (!this.isSuperAdmin()) {
      return this.projectService.activeProjects();
    }
    
    const consultantId = this.selectedConsultantId();
    if (!consultantId) {
      return [];
    }
    
    return this.projectService.getProjectsByConsultant(consultantId);
  });

  readonly projects = computed(() => {
    if (this.isSuperAdmin()) {
      return this.filteredProjects();
    }
    return this.projectService.activeProjects();
  });

  readonly projectsCount = this.projectService.projectsCount;
  readonly pendingActionsCount = this.projectService.pendingActionsCount;

  onConsultantSelect(consultantId: string | null): void {
    this.selectedConsultantId.set(consultantId);
  }

  getStatusColor(status: Project['status']): string {
    const colorMap: Record<Project['status'], string> = {
      'In Progress': 'info',
      'Action Required': 'warning',
      'Under Review': 'success',
      'Completed': 'secondary',
      'Draft': 'secondary'
    };
    return colorMap[status] ?? 'secondary';
  }

  getStatusBadgeText(status: Project['status']): string {
    return status;
  }
}
