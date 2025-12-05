import { Component, DestroyRef, DOCUMENT, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ProgressComponent,
  RowComponent,
  TableDirective,
  WidgetStatBComponent,
  BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../core/services/project.service';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ProgressComponent, TableDirective, RouterLink, WidgetStatBComponent, BadgeComponent]
})
export class DashboardComponent implements OnInit {
  private readonly projectService = inject(ProjectService);

  readonly projects = this.projectService.activeProjects;
  readonly projectsCount = this.projectService.projectsCount;
  readonly pendingActionsCount = this.projectService.pendingActionsCount;

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
