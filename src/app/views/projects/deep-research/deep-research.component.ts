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
  template: `
    <c-row>
      <c-col xs="12">
        <c-card class="mb-4">
          <c-card-header>
            <strong>Step 5: Deep Research & Model Selection</strong>
          </c-card-header>
          <c-card-body>
            <c-row>
              <c-col md="8">
                <h5 class="mb-4">Select AI Model</h5>
                <div class="d-flex gap-3 mb-4">
                  @for (model of models; track model.id) {
                    <c-card
                      [ngClass]="{'border-primary bg-primary-subtle': selectedModel === model.id}"
                      class="cursor-pointer flex-fill"
                      (click)="selectModel(model.id)"
                      style="cursor: pointer;"
                    >
                      <c-card-body class="text-center">
                        <svg cIcon [name]="model.icon" size="3xl" class="mb-3 text-primary"></svg>
                        <h6>{{ model.name }}</h6>
                        <p class="small text-muted mb-0">{{ model.description }}</p>
                      </c-card-body>
                    </c-card>
                  }
                </div>

                <h5 class="mb-3">Research Scope</h5>
                <c-card class="bg-light border-0 mb-4">
                  <c-card-body>
                    <ul class="mb-0">
                      @for (item of scope; track item) {
                        <li class="mb-2">{{ item }}</li>
                      }
                    </ul>
                  </c-card-body>
                </c-card>

                <div class="d-grid">
                  <button cButton color="primary" size="lg" (click)="executeResearch()" [disabled]="isResearching">
                    @if (isResearching) {
                      <c-spinner size="sm" class="me-2"></c-spinner>
                      Researching... {{ researchProgress }}%
                    } @else {
                      Execute Research & Build Strategy
                      <svg cIcon class="ms-2" name="cilRocket"></svg>
                    }
                  </button>
                  @if (isResearching) {
                    <c-progress class="mt-3" [value]="researchProgress" animated></c-progress>
                  }
                </div>
              </c-col>

              <c-col md="4">
                <c-card class="bg-info-subtle border-0 h-100">
                  <c-card-body>
                    <h5 class="card-title text-info-emphasis mb-3">
                      <svg cIcon class="me-2" name="cilInfo"></svg>
                      Why Deep Research?
                    </h5>
                    <p class="text-info-emphasis">
                      ScaleX uses advanced AI agents to crawl the web, analyze competitors, and synthesize market data.
                    </p>
                    <p class="text-info-emphasis">
                      This process ensures your strategy is backed by real-time data and actionable insights, not just generic advice.
                    </p>
                  </c-card-body>
                </c-card>
              </c-col>
            </c-row>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `
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
