import { Component, inject } from '@angular/core';
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
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { Project } from '../../../core/models/project.models';

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
    IconDirective
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);

  readonly projects = this.projectService.activeProjects;
  readonly projectsCount = this.projectService.projectsCount;
  readonly pendingActionsCount = this.projectService.pendingActionsCount;

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
