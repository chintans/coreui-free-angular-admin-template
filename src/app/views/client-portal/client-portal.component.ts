import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, NavModule, TabsModule, TabPanelComponent, TabsContentComponent,
  ProgressComponent, ListGroupDirective, ListGroupItemDirective, AvatarComponent, BadgeComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-client-portal',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, NavModule, TabsModule, TabPanelComponent, TabsContentComponent,
    ProgressComponent, ListGroupDirective, ListGroupItemDirective, AvatarComponent, BadgeComponent,
    IconDirective
  ],
  templateUrl: './client-portal.component.html'
})
export class ClientPortalComponent {
  activeTab = 0;

  timeline = [
    { title: 'Discovery Call', date: 'Oct 15', status: 'Completed', color: 'success' },
    { title: 'Market Research', date: 'Oct 20', status: 'Completed', color: 'success' },
    { title: 'Strategy Development', date: 'Oct 25', status: 'In Progress', color: 'primary' },
    { title: 'Final Report', date: 'Nov 01', status: 'Pending', color: 'secondary' }
  ];

  recommendations = [
    { title: 'Simplify Onboarding', priority: 'High', status: 'Not Started' },
    { title: 'Tiered Support', priority: 'Medium', status: 'In Progress' },
    { title: 'Content Campaign', priority: 'Low', status: 'Planned' }
  ];

  resources = [
    { name: 'Sarah Jenkins', role: 'Content Strategist', email: 'sarah@example.com', avatar: '2.jpg' },
    { name: 'GrowthHacker Agency', role: 'PPC Partner', email: 'contact@growthhacker.com', avatar: '1.jpg' }
  ];

  onTabChange(event: number) {
    this.activeTab = event;
  }
}
