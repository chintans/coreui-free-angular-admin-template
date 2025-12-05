import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  GridModule,
  FormModule,
  ListGroupDirective,
  ListGroupItemDirective,
  BadgeComponent,
  AlertComponent,
  RowComponent,
  ColComponent,
  SpinnerComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { ConversationTopic } from '../../../core/models/project.models';

@Component({
  selector: 'app-conversation-designer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    FormModule,
    ListGroupDirective,
    ListGroupItemDirective,
    BadgeComponent,
    AlertComponent,
    RowComponent,
    ColComponent,
    SpinnerComponent,
    IconDirective
  ],
  templateUrl: './conversation-designer.component.html',
  styleUrls: ['./conversation-designer.component.scss']
})
export class ConversationDesignerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projectId = signal<string>('');
  searchQuery = signal('');
  topics = signal<ConversationTopic[]>([
    { id: '1', title: 'Market Overview', icon: 'cilChartLine', description: 'Understand the target market' },
    { id: '2', title: 'Value Proposition', icon: 'cilStar', description: 'Define unique value' },
    { id: '3', title: 'Competitive Landscape', icon: 'cilPeople', description: 'Analyze competitors' },
    { id: '4', title: 'Customer Pain Points', icon: 'cilWarning', description: 'Identify challenges' }
  ]);
  selectedTopics = signal<ConversationTopic[]>([]);
  suggestions = signal<string[]>([]);
  isGenerating = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
      const project = this.projectService.getProjectById(id);
      if (project) {
        this.loadSuggestions();
      }
    });
  }

  filteredTopics(): ConversationTopic[] {
    const query = this.searchQuery().toLowerCase();
    if (!query) {
      return this.topics();
    }
    return this.topics().filter(t =>
      t.title.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query)
    );
  }

  addTopic(topic: ConversationTopic): void {
    this.selectedTopics.update(topics => [...topics, topic]);
    this.topics.update(topics => topics.filter(t => t.id !== topic.id));
    this.suggestions.update(sugs => sugs.filter(s => !s.includes(topic.title)));
  }

  removeTopic(topic: ConversationTopic): void {
    this.selectedTopics.update(topics => topics.filter(t => t.id !== topic.id));
    this.topics.update(topics => [...topics, topic]);
  }

  generateNew(): void {
    this.isGenerating.set(true);
    // Simulate AI generation
    setTimeout(() => {
      const newSuggestions = [
        'Would you like to include competitive positioning?',
        'Ask about budget constraints and timeline.',
        'Explore decision-making process and stakeholders.',
        'Discuss go-to-market channels and distribution.'
      ];
      this.suggestions.update(sugs => [...sugs, ...newSuggestions]);
      this.isGenerating.set(false);
    }, 1500);
  }

  addSuggestion(suggestion: string): void {
    const newTopic: ConversationTopic = {
      id: Date.now().toString(),
      title: suggestion,
      icon: 'cilLightbulb',
      description: 'AI suggested topic'
    };
    this.addTopic(newTopic);
    this.suggestions.update(sugs => sugs.filter(s => s !== suggestion));
  }

  startRecording(): void {
    if (this.projectId()) {
      this.projectService.updateProjectStep(this.projectId(), 'recording');
      this.router.navigate(['/projects', this.projectId(), 'recording']);
    }
  }

  private loadSuggestions(): void {
    // Initial AI suggestions based on conversation type
    const initialSuggestions = [
      'Would you like to include competitive positioning?',
      'Ask about budget constraints.',
      'Explore decision-making process.'
    ];
    this.suggestions.set(initialSuggestions);
  }
}
