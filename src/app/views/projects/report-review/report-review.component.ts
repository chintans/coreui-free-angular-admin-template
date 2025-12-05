import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, FormModule, BadgeComponent,
  ModalModule, ButtonCloseDirective, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, FormModule, BadgeComponent,
    ModalModule, ButtonCloseDirective, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,
    IconDirective
  ],
  templateUrl: './report-review.component.html'
})
export class ReportReviewComponent {
  private router = inject(Router);

  isEditing = false;
  showShareModal = false;

  reportContent = {
    executiveSummary: 'This strategy outlines a comprehensive approach to entering the enterprise SaaS market, focusing on solving key pain points around onboarding complexity.',
    recommendations: '1. Simplify onboarding flow.\n2. Introduce tiered support for enterprise clients.\n3. Launch targeted content marketing campaign.'
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  toggleShareModal() {
    this.showShareModal = !this.showShareModal;
  }

  shareReport() {
    this.toggleShareModal();
    // Mock share
    alert('Report shared successfully!');
    this.router.navigate(['/projects', '1']);
  }

  downloadPdf() {
    // Mock download
    alert('Downloading PDF...');
  }
}
