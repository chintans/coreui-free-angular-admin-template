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
  templateUrl: './strategy-builder.component.html'
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
