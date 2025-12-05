import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  GridModule,
  FormModule,
  BadgeComponent,
  SpinnerComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { StrategySection } from '../../../core/models/project.models';

@Component({
  selector: 'app-strategy-builder',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    FormModule,
    BadgeComponent,
    SpinnerComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './strategy-builder.component.html',
  styleUrls: ['./strategy-builder.component.scss']
})
export class StrategyBuilderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projectId = signal<string>('');
  sections = signal<StrategySection[]>([]);
  isRegenerating = signal<Record<number, boolean>>({});

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      if (project?.strategy) {
        this.sections.set(project.strategy.sections);
      } else {
        // Initialize with default sections
        this.initializeSections();
      }
    });
  }

  private initializeSections(): void {
    const defaultSections: StrategySection[] = [
      {
        id: '1',
        title: 'Executive Summary',
        status: 'Drafted',
        content: 'This strategy outlines a comprehensive approach to entering the enterprise SaaS market, focusing on solving key pain points around onboarding complexity.'
      },
      {
        id: '2',
        title: 'Market Overview',
        status: 'Auto-filled',
        content: 'The enterprise SaaS market is projected to grow at a CAGR of 15% over the next 5 years, driven by digital transformation initiatives.'
      },
      {
        id: '3',
        title: 'Target Segments',
        status: 'Auto-filled',
        content: 'Primary focus on Fortune 500 companies in the financial and healthcare sectors.'
      },
      {
        id: '4',
        title: 'Competitive Positioning',
        status: 'Drafted',
        content: 'Our key differentiator is the AI-driven onboarding assistant that reduces time-to-value by 40%.'
      },
      {
        id: '5',
        title: 'Action Plan',
        status: 'Pending',
        content: ''
      }
    ];
    this.sections.set(defaultSections);
  }

  getStatusColor(status: StrategySection['status']): string {
    const colorMap: Record<StrategySection['status'], string> = {
      'Drafted': 'success',
      'Auto-filled': 'info',
      'Pending': 'secondary'
    };
    return colorMap[status] ?? 'secondary';
  }

  regenerateSection(index: number): void {
    this.isRegenerating.update(state => ({ ...state, [index]: true }));
    
    // Simulate regeneration
    setTimeout(() => {
      this.sections.update(sections => {
        const updated = [...sections];
        updated[index] = {
          ...updated[index],
          status: 'Auto-filled',
          content: updated[index].content || 'Generated content based on latest research and insights...'
        };
        return updated;
      });
      this.isRegenerating.update(state => ({ ...state, [index]: false }));
    }, 1500);
  }

  saveAndContinue(): void {
    if (!this.projectId()) {
      return;
    }

    // Update strategy with sections
    const project = this.projectService.getProjectById(this.projectId());
    if (project?.strategy) {
      const updatedStrategy = {
        ...project.strategy,
        sections: this.sections()
      };
      this.projectService.setStrategy(this.projectId(), updatedStrategy);
    }

    this.projectService.updateProjectStep(this.projectId(), 'report');
    this.projectService.updateProjectProgress(this.projectId(), 85);
    this.router.navigate(['/projects', this.projectId(), 'report']);
  }
}
