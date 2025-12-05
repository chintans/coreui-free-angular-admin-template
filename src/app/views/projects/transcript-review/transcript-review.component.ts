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
  SpinnerComponent,
  AlertComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';

interface Insight {
  title: string;
  description: string;
  type: 'Pain Point' | 'Opportunity' | 'Insight';
}

@Component({
  selector: 'app-transcript-review',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    FormModule,
    SpinnerComponent,
    AlertComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './transcript-review.component.html',
  styleUrls: ['./transcript-review.component.scss']
})
export class TranscriptReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projectId = signal<string>('');
  transcript = signal('');
  isAnalyzing = signal(false);
  showInsights = signal(false);
  insights = signal<Insight[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      if (project?.transcript) {
        this.transcript.set(project.transcript.content);
      } else {
        // Fallback to mock data
        this.transcript.set(this.getMockTranscript());
      }
    });
  }

  analyze(): void {
    this.isAnalyzing.set(true);
    // Simulate AI analysis
    setTimeout(() => {
      const extractedInsights: Insight[] = [
        {
          title: 'Pain Point',
          description: 'High churn in enterprise segment due to complex onboarding process.',
          type: 'Pain Point'
        },
        {
          title: 'Opportunity',
          description: 'Simplify enterprise onboarding to improve customer retention rates.',
          type: 'Opportunity'
        },
        {
          title: 'Insight',
          description: 'Low adoption of loyalty programs suggests need for better engagement strategy.',
          type: 'Insight'
        }
      ];
      this.insights.set(extractedInsights);
      this.isAnalyzing.set(false);
      this.showInsights.set(true);
    }, 2000);
  }

  generatePrompt(): void {
    if (this.projectId()) {
      this.projectService.updateProjectStep(this.projectId(), 'research');
      this.projectService.updateProjectProgress(this.projectId(), 50);
      this.router.navigate(['/projects', this.projectId(), 'research']);
    }
  }

  getInsightColor(type: Insight['type']): string {
    const colorMap: Record<Insight['type'], string> = {
      'Pain Point': 'danger',
      'Opportunity': 'success',
      'Insight': 'info'
    };
    return colorMap[type] ?? 'secondary';
  }

  private getMockTranscript(): string {
    return `Consultant: So, tell me about your main challenges.
Client: Well, we are struggling with customer retention.
Consultant: Interesting. Is it across all segments?
Client: Mostly in the enterprise segment.
Consultant: I see. Have you tried any loyalty programs?
Client: We have, but adoption is low.
Consultant: What kind of feedback are you getting?
Client: They say the onboarding is too complex.
Consultant: That makes sense. Complex onboarding can definitely impact retention.
Client: Exactly. We need to simplify the process.
Consultant: Have you considered a guided onboarding flow?
Client: We have, but implementation has been delayed.`;
  }
}
