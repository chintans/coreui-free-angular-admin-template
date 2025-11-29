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
  template: `
    <c-row>
      <c-col xs="12">
        <c-card class="mb-4">
          <c-card-header>
            <strong>Step 2: Conversation Designer</strong>
          </c-card-header>
          <c-card-body>
            <c-row>
              <c-col md="8">
                <div class="mb-3">
                  <label cLabel>Search Topics</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <svg cIcon name="cilSearch"></svg>
                    </span>
                    <input cFormControl placeholder="Search for discussion points..." />
                  </div>
                </div>

                <h5 class="mb-3">Discussion Topics</h5>
                <ul cListGroup class="mb-4">
                  @for (topic of topics; track topic) {
                    <li cListGroupItem class="d-flex justify-content-between align-items-center">
                      <div>
                        <svg cIcon class="me-2" name="cilList"></svg>
                        {{ topic }}
                      </div>
                      <button cButton color="danger" variant="ghost" size="sm">
                        <svg cIcon name="cilTrash"></svg>
                      </button>
                    </li>
                  }
                </ul>

                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button cButton color="secondary" variant="outline">Save Draft</button>
                  <button cButton color="primary" (click)="startRecording()">
                    Start Recording
                    <svg cIcon class="ms-2" name="cilMicrophone"></svg>
                  </button>
                </div>
              </c-col>

              <c-col md="4">
                <c-card class="bg-light border-0">
                  <c-card-body>
                    <h5 class="card-title text-primary">
                      <svg cIcon class="me-2" name="cilLightbulb"></svg>
                      AI Suggestions
                    </h5>
                    <p class="small text-body-secondary">Based on "Go-To-Market Strategy"</p>

                    @for (suggestion of suggestions; track suggestion) {
                      <c-alert color="info" class="d-flex justify-content-between align-items-center p-2 mb-2">
                        <small>{{ suggestion }}</small>
                        <button cButton color="link" size="sm" class="p-0 ms-2" (click)="addTopic(suggestion)">
                          <svg cIcon name="cilPlus"></svg>
                        </button>
                      </c-alert>
                    }

                    <div class="d-grid mt-3">
                      <button cButton color="primary" variant="outline" size="sm" (click)="generateNew()">
                        <svg cIcon class="me-2" name="cilReload"></svg>
                        Generate New
                      </button>
                    </div>
                  </c-card-body>
                </c-card>
              </c-col>
            </c-row>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `
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
