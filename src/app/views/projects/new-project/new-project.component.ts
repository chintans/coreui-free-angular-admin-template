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
  templateUrl: './new-project.component.html'
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
