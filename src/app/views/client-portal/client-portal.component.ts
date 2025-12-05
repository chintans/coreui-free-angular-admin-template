import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  GridModule,
  NavModule,
  TabsModule,
  TabPanelComponent,
  ListGroupDirective,
  ListGroupItemDirective,
  BadgeComponent,
  ProgressComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../core/services/project.service';
import type { Project, StrategicAction, Resource, ProjectStep } from '../../core/models/project.models';

interface TimelineStep {
  title: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  color: string;
  description?: string;
}

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    NavModule,
    TabsModule,
    TabPanelComponent,
    ListGroupDirective,
    ListGroupItemDirective,
    BadgeComponent,
    ProgressComponent,
    IconDirective
  ],
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.scss']
})
export class ClientPortalComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  activeTab = signal<number>(0);
  projectId = signal<string>('');
  project = signal<Project | undefined>(undefined);

  readonly timelineSteps = computed<TimelineStep[]>(() => {
    const currentProject = this.project();
    if (!currentProject) {
      return [];
    }

    const steps: TimelineStep[] = [];
    const stepOrder: ProjectStep[] = ['setup', 'design', 'recording', 'transcript', 'research', 'strategy', 'report'];
    const stepTitles: Record<ProjectStep, string> = {
      setup: 'Project Setup',
      design: 'Conversation Design',
      recording: 'Recording Session',
      transcript: 'Transcript Review',
      research: 'Deep Research',
      strategy: 'Strategy Development',
      report: 'Report Finalization'
    };

    let foundCurrentStep = false;
    stepOrder.forEach((step, index) => {
      const isCurrentStep = currentProject.currentStep === step;
      const isBeforeCurrent = stepOrder.indexOf(currentProject.currentStep) > index;

      if (isBeforeCurrent || isCurrentStep) {
        foundCurrentStep = true;
      }

      let status: 'Completed' | 'In Progress' | 'Pending';
      let color: string;

      if (isBeforeCurrent) {
        status = 'Completed';
        color = 'success';
      } else if (isCurrentStep) {
        status = 'In Progress';
        color = 'primary';
      } else {
        status = 'Pending';
        color = 'secondary';
      }

      const stepDate = new Date(currentProject.createdAt);
      stepDate.setDate(stepDate.getDate() + index * 3);

      steps.push({
        title: stepTitles[step],
        date: stepDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status,
        color,
        description: isCurrentStep ? 'Currently in progress' : undefined
      });
    });

    return steps;
  });

  readonly assignedResources = computed<Resource[]>(() => {
    const currentProject = this.project();
    if (!currentProject?.strategicActions) {
      return [];
    }

    const resources: Resource[] = [];
    const resourceMap = new Map<string, Resource>();

    currentProject.strategicActions.forEach(action => {
      if (action.assignedResource && !resourceMap.has(action.assignedResource.id)) {
        resourceMap.set(action.assignedResource.id, action.assignedResource);
        resources.push(action.assignedResource);
      }
    });

    return resources;
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'] ?? params['projectId'];
      if (id) {
        this.projectId.set(id);
        const project = this.projectService.getProjectById(id);
        this.project.set(project);

        if (!project) {
          // If no project found, try to get the first project as fallback
          const projects = this.projectService.projects();
          if (projects.length > 0) {
            this.project.set(projects[0]);
            this.projectId.set(projects[0].id);
          }
        }
      } else {
        // If no ID provided, use the first project
        const projects = this.projectService.projects();
        if (projects.length > 0) {
          this.project.set(projects[0]);
          this.projectId.set(projects[0].id);
        }
      }
    });

    // Also check query params
    this.route.queryParams.subscribe(queryParams => {
      const id = queryParams['projectId'];
      if (id && !this.projectId()) {
        const project = this.projectService.getProjectById(id);
        if (project) {
          this.project.set(project);
          this.projectId.set(id);
        }
      }
    });
  }

  onTabChange(tabIndex: number): void {
    this.activeTab.set(tabIndex);
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

  getActionStatusColor(status: StrategicAction['status']): string {
    const colorMap: Record<StrategicAction['status'], string> = {
      'Pending': 'warning',
      'In Progress': 'info',
      'Completed': 'success'
    };
    return colorMap[status] ?? 'secondary';
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(name: string): string {
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index] ?? 'primary';
  }

  downloadReport(): void {
    const currentProject = this.project();
    if (!currentProject?.report) {
      return;
    }

    // Simulate PDF download
    const reportContent = this.generateReportContent(currentProject);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentProject.name.replace(/\s+/g, '-')}-Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private generateReportContent(project: Project): string {
    let content = `\n${project.name}\n`;
    content += `${project.client}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    content += '='.repeat(50) + '\n\n';

    if (project.report?.executiveSummary) {
      content += 'EXECUTIVE SUMMARY\n';
      content += '-'.repeat(50) + '\n';
      content += `${project.report.executiveSummary}\n\n`;
    }

    if (project.report?.sections) {
      project.report.sections.forEach(section => {
        content += `${section.title.toUpperCase()}\n`;
        content += '-'.repeat(50) + '\n';
        content += `${section.content}\n\n`;
      });
    }

    if (project.report?.recommendations) {
      content += 'KEY RECOMMENDATIONS\n';
      content += '-'.repeat(50) + '\n';
      project.report.recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec}\n`;
      });
    }

    return content;
  }
}
