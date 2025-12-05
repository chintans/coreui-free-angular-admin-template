import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  GridModule,
  FormModule,
  ModalModule,
  ButtonCloseDirective,
  ModalComponent,
  ModalHeaderComponent,
  ModalBodyComponent,
  ModalFooterComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { ReportData } from '../../../core/models/project.models';

@Component({
  selector: 'app-report-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    FormModule,
    ModalModule,
    ButtonCloseDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './report-review.component.html',
  styleUrls: ['./report-review.component.scss']
})
export class ReportReviewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly fb = inject(FormBuilder);

  projectId = signal<string>('');
  isEditing = signal(false);
  showShareModal = signal(false);

  reportContent = signal({
    executiveSummary: '',
    recommendations: ''
  });

  shareForm = this.fb.group({
    emails: ['', [Validators.required, Validators.email]],
    message: ['']
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      if (project?.report) {
        this.loadReport(project.report);
      } else {
        this.loadDefaultReport();
      }
    });
  }

  private loadReport(report: ReportData): void {
    this.reportContent.set({
      executiveSummary: report.executiveSummary,
      recommendations: report.recommendations.join('\n')
    });
  }

  private loadDefaultReport(): void {
    this.reportContent.set({
      executiveSummary: 'This strategy outlines a comprehensive approach to entering the enterprise SaaS market, focusing on solving key pain points around onboarding complexity. Our research indicates significant opportunities for growth through simplified user experiences and targeted market positioning.',
      recommendations: '1. Simplify onboarding flow to reduce time-to-value by 40%\n2. Introduce tiered support for enterprise clients\n3. Launch targeted content marketing campaign\n4. Develop strategic partnerships with key industry players\n5. Implement data-driven customer success program'
    });
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      this.saveReport();
    }
    this.isEditing.update(val => !val);
  }

  private saveReport(): void {
    if (!this.projectId()) {
      return;
    }

    const reportData: ReportData = {
      executiveSummary: this.reportContent().executiveSummary,
      recommendations: this.reportContent().recommendations.split('\n').filter(r => r.trim()),
      sections: []
    };

    this.projectService.setReport(this.projectId(), reportData);
  }

  toggleShareModal(): void {
    this.showShareModal.update(val => !val);
    if (!this.showShareModal()) {
      this.shareForm.reset();
    }
  }

  shareReport(): void {
    if (this.shareForm.valid && this.projectId()) {
      const emails = this.shareForm.value.emails?.split(',').map(e => e.trim()) ?? [];
      const message = this.shareForm.value.message ?? '';

      this.projectService.shareReport(this.projectId(), emails, message);
      this.toggleShareModal();
      this.router.navigate(['/projects', this.projectId()]);
    }
  }

  downloadPdf(): void {
    // In production, this would generate and download a PDF
    alert('PDF download functionality will be implemented with a PDF generation library.');
  }

  updateExecutiveSummary(value: string): void {
    this.reportContent.update(content => ({ ...content, executiveSummary: value }));
  }

  updateRecommendations(value: string): void {
    this.reportContent.update(content => ({ ...content, recommendations: value }));
  }
}
