import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  FormModule, ButtonDirective, GridModule
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    FormModule, ButtonDirective, GridModule, IconDirective
  ],
  template: `
    <c-row>
      <c-col xs="12">
        <c-card class="mb-4">
          <c-card-header>
            <strong>Step 1: New Project Setup</strong>
          </c-card-header>
          <c-card-body>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label cLabel for="projectName">Project Name</label>
                <input cFormControl id="projectName" formControlName="projectName" placeholder="Enter project name" />
              </div>

              <div class="mb-3">
                <label cLabel for="client">Client / Company</label>
                <select cSelect id="client" formControlName="client">
                  <option value="">Select Client</option>
                  <option value="Acme Corp">Acme Corp</option>
                  <option value="Globex Inc">Globex Inc</option>
                  <option value="Soylent Corp">Soylent Corp</option>
                </select>
              </div>

              <div class="mb-3">
                <label cLabel>Reference Documents</label>
                <input cFormControl type="file" />
                <div class="form-text">Upload PDFs or DOCX files for context.</div>
              </div>

              <div class="mb-4">
                <label cLabel>Conversation Type</label>
                <div>
                  <c-form-check class="mb-2">
                    <input cFormCheckInput type="radio" value="gtm" formControlName="conversationType" id="typeGtm" />
                    <label cFormCheckLabel for="typeGtm">Go-To-Market Strategy</label>
                  </c-form-check>
                  <c-form-check class="mb-2">
                    <input cFormCheckInput type="radio" value="consumer" formControlName="conversationType" id="typeConsumer" />
                    <label cFormCheckLabel for="typeConsumer">Consumer Research</label>
                  </c-form-check>
                  <c-form-check class="mb-2">
                    <input cFormCheckInput type="radio" value="strategy" formControlName="conversationType" id="typeStrategy" />
                    <label cFormCheckLabel for="typeStrategy">Strategy Review</label>
                  </c-form-check>
                  <c-form-check>
                    <input cFormCheckInput type="radio" value="custom" formControlName="conversationType" id="typeCustom" />
                    <label cFormCheckLabel for="typeCustom">Custom</label>
                  </c-form-check>
                </div>
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button cButton color="primary" type="submit" [disabled]="form.invalid">
                  Next: Design Conversation
                  <svg cIcon class="ms-2" name="cilArrowRight"></svg>
                </button>
              </div>
            </form>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `
})
export class NewProjectComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form = this.fb.group({
    projectName: ['', Validators.required],
    client: ['', Validators.required],
    conversationType: ['gtm', Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      // Mock saving and navigating
      console.log(this.form.value);
      this.router.navigate(['/projects', '1', 'design']);
    }
  }
}
