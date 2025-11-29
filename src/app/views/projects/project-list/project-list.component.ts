import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent } from '@coreui/angular';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, CardComponent, CardBodyComponent, CardHeaderComponent],
    template: `
    <c-card class="mb-4">
      <c-card-header>
        <strong>Projects</strong>
      </c-card-header>
      <c-card-body>
        <p>Project List Placeholder</p>
      </c-card-body>
    </c-card>
  `
})
export class ProjectListComponent { }
