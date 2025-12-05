import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent } from '@coreui/angular';

@Component({
    selector: 'app-project-detail',
    standalone: true,
    imports: [CommonModule, CardComponent, CardBodyComponent, CardHeaderComponent],
    templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent { }
