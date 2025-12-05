import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, FormModule, BadgeComponent,
  SpinnerComponent, ProgressComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-deep-research',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, FormModule, BadgeComponent,
    SpinnerComponent, ProgressComponent, IconDirective
  ],
  templateUrl: './deep-research.component.html'
})
export class DeepResearchComponent {
  private router = inject(Router);

  selectedModel = 'gemini';
  isResearching = false;
  researchProgress = 0;

  models = [
    { id: 'gemini', name: 'Gemini 1.5 Pro', description: 'Best for reasoning and large context.', icon: 'cibGoogle' },
    { id: 'gpt4', name: 'GPT-4o', description: 'Creative and versatile.', icon: 'cibOpenai' },
    { id: 'deepsea', name: 'DeepSea', description: 'Specialized for market research.', icon: 'cilWaves' }
  ];

  scope = [
    'Target Market Analysis (Enterprise SaaS)',
    'Competitor Feature Comparison',
    'Pricing Models',
    'Customer Sentiment Analysis'
  ];

  selectModel(id: string) {
    this.selectedModel = id;
  }

  executeResearch() {
    this.isResearching = true;
    const interval = setInterval(() => {
      this.researchProgress += 10;
      if (this.researchProgress >= 100) {
        clearInterval(interval);
        this.isResearching = false;
        this.router.navigate(['/projects', '1', 'strategy']);
      }
    }, 500);
  }
}
