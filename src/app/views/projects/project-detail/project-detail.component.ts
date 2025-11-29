import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent } from '@coreui/angular';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule, CardComponent, CardBodyComponent, CardHeaderComponent],
    template: `
    <c-card class="mb-4">
      <c-card-header>
        <strong>Project Details</strong>
      </c-card-header>
      <c-card-body>
        <p>Project Details Placeholder</p>
      </c-card-body>
    </c-card>
  `
})
export class ProjectDetailComponent { }
