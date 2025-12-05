import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardBodyComponent, CardHeaderComponent } from '@coreui/angular';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [CommonModule, CardComponent, CardBodyComponent, CardHeaderComponent],
    templateUrl: './project-list.component.html'
})
export class ProjectListComponent { }
