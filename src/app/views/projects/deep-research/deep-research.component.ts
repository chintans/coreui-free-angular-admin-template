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
  ProgressComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { AIModel, StrategyData } from '../../../core/models/project.models';

interface ModelOption {
  id: AIModel;
  name: string;
  description: string;
  icon: string;
  strength: string;
}

@Component({
  selector: 'app-deep-research',
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
    ProgressComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './deep-research.component.html',
  styleUrls: ['./deep-research.component.scss']
})
export class DeepResearchComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projectId = signal<string>('');
  selectedModel = signal<AIModel>('gemini');
  isResearching = signal(false);
  researchProgress = signal(0);

  models: ModelOption[] = [
    {
      id: 'gemini',
      name: 'Gemini 1.5 Pro',
      description: 'Best for reasoning and large context',
      icon: 'cilChart',
      strength: 'Reasoning'
    },
    {
      id: 'gpt4',
      name: 'GPT-4o',
      description: 'Creative and versatile',
      icon: 'cilLightbulb',
      strength: 'Creative'
    },
    {
      id: 'deepsea',
      name: 'DeepSea',
      description: 'Specialized for market research with citations',
      icon: 'cilWaves',
      strength: 'Citations'
    }
  ];

  researchScope = signal<string[]>([
    'Target Market Analysis',
    'Competitor Feature Comparison',
    'Pricing Models',
    'Customer Sentiment Analysis'
  ]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      if (project) {
        // Load research scope based on project insights
        this.loadResearchScope(project);
      }
    });
  }

  selectModel(modelId: AIModel): void {
    this.selectedModel.set(modelId);
  }

  executeResearch(): void {
    if (!this.projectId()) {
      return;
    }

    this.isResearching.set(true);
    this.researchProgress.set(0);

    // Simulate research progress
    const interval = setInterval(() => {
      this.researchProgress.update(progress => {
        const newProgress = progress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          this.completeResearch();
          return 100;
        }
        return newProgress;
      });
    }, 500);
  }

  private completeResearch(): void {
    if (!this.projectId()) {
      return;
    }

    // Save strategy data
    const strategyData: StrategyData = {
      sections: [],
      model: this.selectedModel(),
      researchScope: this.researchScope()
    };

    this.projectService.setStrategy(this.projectId(), strategyData);
    this.projectService.updateProjectStep(this.projectId(), 'strategy');
    this.projectService.updateProjectProgress(this.projectId(), 70);
    this.isResearching.set(false);

    setTimeout(() => {
      this.router.navigate(['/projects', this.projectId(), 'strategy']);
    }, 500);
  }

  private loadResearchScope(project: any): void {
    // Generate research scope based on project type and insights
    if (project.conversationType === 'gtm') {
      this.researchScope.set([
        'Target Market Analysis',
        'Competitor Positioning',
        'Go-To-Market Channels',
        'Pricing Strategy'
      ]);
    } else if (project.conversationType === 'consumer') {
      this.researchScope.set([
        'Target Audience Segmentation',
        'Consumer Behavior Analysis',
        'Market Trends',
        'Competitive Landscape'
      ]);
    }
  }
}
