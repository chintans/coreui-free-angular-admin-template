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
  selector: 'app-strategy-builder',
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
            <strong>Step 6: Strategy Builder</strong>
          </c-card-header>
          <c-card-body>
            <c-row>
              <c-col md="8">
                <h5 class="mb-4">Strategy Sections</h5>
                @for (section of sections; track section.title; let i = $index) {
                  <c-card class="mb-3">
                    <c-card-header class="d-flex justify-content-between align-items-center">
                      <strong>{{ section.title }}</strong>
                      <div>
                        <c-badge [color]="getStatusColor(section.status)" class="me-2">{{ section.status }}</c-badge>
                        <button cButton color="secondary" variant="ghost" size="sm" (click)="regenerateSection(i)">
                          <svg cIcon name="cilReload"></svg>
                        </button>
                      </div>
                    </c-card-header>
                    <c-card-body>
                      <p class="mb-0 text-muted">{{ section.content || 'Pending generation...' }}</p>
                    </c-card-body>
                  </c-card>
                }

                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button cButton color="primary" size="lg" (click)="saveAndContinue()">
                    Save & Continue
                    <svg cIcon class="ms-2" name="cilArrowRight"></svg>
                  </button>
                </div>
              </c-col>

              <c-col md="4">
                <c-card class="bg-light border-0">
                  <c-card-body>
                    <h5 class="card-title text-primary mb-3">
                      <svg cIcon class="me-2" name="cilSettings"></svg>
                      Configuration
                    </h5>
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Tone of Voice</label>
                      <select class="form-select form-select-sm">
                        <option>Professional</option>
                        <option>Persuasive</option>
                        <option>Technical</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label class="form-label small fw-bold">Format</label>
                      <select class="form-select form-select-sm">
                        <option>Standard Report</option>
                        <option>Presentation Deck</option>
                        <option>Memo</option>
                      </select>
                    </div>
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
export class StrategyBuilderComponent {
  private router = inject(Router);

  sections = [
    { title: 'Executive Summary', status: 'Drafted', content: 'This strategy outlines a comprehensive approach to entering the enterprise SaaS market, focusing on solving key pain points around onboarding complexity.' },
    { title: 'Market Overview', status: 'Auto-filled', content: 'The enterprise SaaS market is projected to grow at a CAGR of 15% over the next 5 years, driven by digital transformation initiatives.' },
    { title: 'Target Segments', status: 'Auto-filled', content: 'Primary focus on Fortune 500 companies in the financial and healthcare sectors.' },
    { title: 'Competitive Positioning', status: 'Drafted', content: 'Our key differentiator is the AI-driven onboarding assistant that reduces time-to-value by 40%.' },
    { title: 'Action Plan', status: 'Pending', content: '' }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'Drafted': return 'success';
      case 'Auto-filled': return 'info';
      case 'Pending': return 'secondary';
      case 'Regenerating...': return 'warning';
      default: return 'secondary';
    }
  }

  regenerateSection(index: number) {
    const originalStatus = this.sections[index].status;
    this.sections[index].status = 'Regenerating...';
    setTimeout(() => {
      this.sections[index].status = 'Auto-filled';
      if (!this.sections[index].content) {
        this.sections[index].content = 'Generated content based on latest research...';
      }
    }, 1500);
  }

  saveAndContinue() {
    this.router.navigate(['/projects', '1', 'report']);
  }
}
