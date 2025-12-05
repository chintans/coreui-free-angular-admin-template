import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  FormModule,
  ButtonDirective,
  GridModule,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { ConversationType } from '../../../core/models/project.models';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    FormModule,
    ButtonDirective,
    GridModule,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  selectedFiles: File[] = [];

  form = this.fb.group({
    projectName: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)]
    }),
    client: this.fb.control('', { validators: Validators.required }),
    conversationType: this.fb.control<ConversationType>('gtm', { validators: Validators.required })
  });

  conversationTypes: Array<{
    value: ConversationType;
    label: string;
    icon: string;
    description: string;
  }> = [
    {
      value: 'gtm',
      label: 'Go-To-Market Strategy',
      icon: 'cilChartLine',
      description: 'Plan your market entry strategy'
    },
    {
      value: 'consumer',
      label: 'Consumer Research',
      icon: 'cilPeople',
      description: 'Understand your target audience'
    },
    {
      value: 'strategy',
      label: 'Strategy Review',
      icon: 'cilCheckCircle',
      description: 'Review and refine existing strategies'
    },
    {
      value: 'custom',
      label: 'Custom',
      icon: 'cilSettings',
      description: 'Create a custom conversation flow'
    }
  ];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const projectData = {
        name: this.form.value.projectName ?? '',
        client: this.form.value.client ?? '',
        conversationType: this.form.value.conversationType ?? 'gtm',
        referenceDocs: this.selectedFiles.length > 0 ? this.selectedFiles : undefined
      };

      const project = this.projectService.createProject(projectData);
      this.router.navigate(['/projects', project.id, 'design']);
    }
  }

  getConversationTypeIcon(type: ConversationType): string {
    const typeConfig = this.conversationTypes.find(t => t.value === type);
    return typeConfig?.icon ?? 'cilSettings';
  }
}
