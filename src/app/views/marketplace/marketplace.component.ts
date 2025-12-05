import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, FormModule, BadgeComponent,
  AvatarComponent, ModalModule, ButtonCloseDirective, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, FormModule, BadgeComponent,
    AvatarComponent, ModalModule, ButtonCloseDirective, ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent,
    IconDirective
  ],
  templateUrl: './marketplace.component.html'
})
export class MarketplaceComponent {
  private fb = inject(FormBuilder);

  showResourceModal = false;

  providers = [
    { name: 'GrowthHacker Agency', type: 'Agency', rating: 4.8, rate: '$150/hr', avatar: '1.jpg', skills: ['GTM Strategy', 'PPC'] },
    { name: 'Sarah Jenkins', type: 'Independent', rating: 4.9, rate: '$120/hr', avatar: '2.jpg', skills: ['Content Marketing', 'SEO'] },
    { name: 'Enterprise Solutions', type: 'Agency', rating: 4.7, rate: '$200/hr', avatar: '3.jpg', skills: ['Sales Enablement', 'CRM'] }
  ];

  resourceForm = this.fb.group({
    fullName: ['', Validators.required],
    role: ['', Validators.required],
    company: [''],
    email: ['', [Validators.required, Validators.email]]
  });

  toggleResourceModal() {
    this.showResourceModal = !this.showResourceModal;
  }

  addResource() {
    if (this.resourceForm.valid) {
      console.log(this.resourceForm.value);
      this.toggleResourceModal();
      alert('Resource added successfully!');
    }
  }
}
