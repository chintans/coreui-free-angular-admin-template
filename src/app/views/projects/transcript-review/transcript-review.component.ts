import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, FormModule, BadgeComponent,
  SpinnerComponent, AlertComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-transcript-review',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, FormModule, BadgeComponent,
    SpinnerComponent, AlertComponent, IconDirective
  ],
  templateUrl: './transcript-review.component.html'
})
export class TranscriptReviewComponent {
  private router = inject(Router);

  isAnalyzing = false;
  showInsights = false;

  transcript = `Consultant: So, tell me about your main challenges.
Client: Well, we are struggling with customer retention.
Consultant: Interesting. Is it across all segments?
Client: Mostly in the enterprise segment.
Consultant: I see. Have you tried any loyalty programs?
Client: We have, but adoption is low.
Consultant: What kind of feedback are you getting?
Client: They say the onboarding is too complex.`;

  insights = [
    { title: 'Pain Point', description: 'High churn in enterprise segment due to complex onboarding.' },
    { title: 'Opportunity', description: 'Simplify enterprise onboarding process to improve retention.' }
  ];

  analyze() {
    this.isAnalyzing = true;
    setTimeout(() => {
      this.isAnalyzing = false;
      this.showInsights = true;
    }, 2000);
  }

  generatePrompt() {
    this.router.navigate(['/projects', '1', 'research']);
  }
}
