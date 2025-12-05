import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, FormModule, ListGroupDirective, ListGroupItemDirective,
  BadgeComponent, AlertComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-conversation-designer',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, FormModule, ListGroupDirective, ListGroupItemDirective,
    BadgeComponent, AlertComponent, IconDirective
  ],
  templateUrl: './conversation-designer.component.html'
})
export class ConversationDesignerComponent {
  private router = inject(Router);

  topics = [
    'Market Overview',
    'Value Proposition',
    'Competitive Landscape',
    'Customer Pain Points'
  ];

  suggestions = [
    'Would you like to include competitive positioning?',
    'Ask about budget constraints.',
    'Explore decision-making process.'
  ];

  addTopic(topic: string) {
    this.topics.push(topic);
    this.suggestions = this.suggestions.filter(s => s !== topic);
  }

  generateNew() {
    // Mock AI generation
    this.suggestions.push('New AI Suggestion ' + (this.suggestions.length + 1));
  }

  startRecording() {
    this.router.navigate(['/projects', '1', 'recording']);
  }
}
