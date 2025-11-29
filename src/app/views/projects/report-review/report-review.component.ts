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
  template: `
    <c-row>
      <c-col xs="12">
        <c-card class="mb-4">
          <c-card-header class="d-flex justify-content-between align-items-center">
            <strong>Step 7: Report Review & Editor</strong>
            <div>
              <button cButton [color]="isEditing ? 'success' : 'secondary'" variant="outline" class="me-2" (click)="toggleEdit()">
                <svg cIcon class="me-2" [name]="isEditing ? 'cilSave' : 'cilPencil'"></svg>
                {{ isEditing ? 'Save Changes' : 'Edit Report' }}
              </button>
              <button cButton color="primary" (click)="toggleShareModal()">
                <svg cIcon class="me-2" name="cilShareBoxed"></svg>
                Share for Review
              </button>
            </div>
          </c-card-header>
          <c-card-body>
            <div class="mb-4">
              <h4 class="mb-3">Executive Summary</h4>
              @if (isEditing) {
                <textarea cFormControl rows="4" [(ngModel)]="reportContent.executiveSummary"></textarea>
              } @else {
                <p class="lead">{{ reportContent.executiveSummary }}</p>
              }
            </div>

            <div class="mb-4">
              <h4 class="mb-3">Strategic Recommendations</h4>
              @if (isEditing) {
                <textarea cFormControl rows="6" [(ngModel)]="reportContent.recommendations"></textarea>
              } @else {
                <div class="bg-light p-3 rounded">
                  <pre class="mb-0" style="white-space: pre-wrap; font-family: inherit;">{{ reportContent.recommendations }}</pre>
                </div>
              }
            </div>

            <hr class="my-4">

            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">Last saved: Just now</span>
              <button cButton color="secondary" variant="ghost" (click)="downloadPdf()">
                <svg cIcon class="me-2" name="cilCloudDownload"></svg>
                Download PDF
              </button>
            </div>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>

    <c-modal [visible]="showShareModal" (visibleChange)="toggleShareModal()">
      <c-modal-header>
        <h5 cModalTitle>Share Report</h5>
        <button cButtonClose (click)="toggleShareModal()"></button>
      </c-modal-header>
      <c-modal-body>
        <div class="mb-3">
          <label cLabel>Invite Reviewers (Email)</label>
          <input cFormControl placeholder="colleague@example.com" />
        </div>
        <div class="mb-3">
          <label cLabel>Message (Optional)</label>
          <textarea cFormControl rows="3" placeholder="Please review the attached strategy report..."></textarea>
        </div>
      </c-modal-body>
      <c-modal-footer>
        <button cButton color="secondary" (click)="toggleShareModal()">Cancel</button>
        <button cButton color="primary" (click)="shareReport()">Send Invitation</button>
      </c-modal-footer>
    </c-modal>
  `
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
