import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ButtonDirective,
  GridModule,
  BadgeComponent,
  RowComponent,
  ColComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ProjectService } from '../../../core/services/project.service';
import { TranscriptData, TranscriptTag } from '../../../core/models/project.models';

@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    GridModule,
    BadgeComponent,
    RowComponent,
    ColComponent,
    IconDirective
  ],
  templateUrl: './recording.component.html',
  styleUrls: ['./recording.component.scss']
})
export class RecordingComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);

  projectId = signal<string>('');
  isRecording = signal(false);
  isPaused = signal(false);
  timer = signal(0);
  intervalId: any;

  transcript = signal<Array<{ speaker: string; text: string; time: string }>>([]);
  tags = signal<TranscriptTag[]>([]);

  mockDialogue = [
    'So, tell me about your main challenges.',
    'Well, we are struggling with customer retention.',
    'Interesting. Is it across all segments?',
    'Mostly in the enterprise segment.',
    'I see. Have you tried any loyalty programs?',
    'We have, but adoption is low.',
    'What kind of feedback are you getting?',
    'They say the onboarding is too complex.',
    'That makes sense. Complex onboarding can definitely impact retention.',
    'Exactly. We need to simplify the process.',
    'Have you considered a guided onboarding flow?',
    'We have, but implementation has been delayed.'
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.projectId.set(id);
    });
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  toggleRecording(): void {
    if (this.isRecording()) {
      this.isPaused.update(val => !val);
      if (this.isPaused()) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    } else {
      this.startRecording();
    }
  }

  startRecording(): void {
    this.isRecording.set(true);
    this.isPaused.set(false);
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.timer.update(val => val + 1);
      if (this.timer() % 3 === 0 && this.transcript().length < this.mockDialogue.length) {
        this.addMockTranscript();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  addMockTranscript(): void {
    const index = this.transcript().length;
    const speaker = index % 2 === 0 ? 'Consultant' : 'Client';
    this.transcript.update(transcript => [
      ...transcript,
      {
        speaker,
        text: this.mockDialogue[index],
        time: this.formatTime(this.timer())
      }
    ]);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  addTag(type: TranscriptTag['type']): void {
    const currentTime = this.timer();
    const lastTranscript = this.transcript()[this.transcript().length - 1];
    const tag: TranscriptTag = {
      type,
      text: lastTranscript?.text ?? '',
      timestamp: currentTime
    };
    this.tags.update(tags => [...tags, tag]);
  }

  finishRecording(): void {
    this.stopTimer();
    this.isRecording.set(false);

    // Save transcript to project
    if (this.projectId()) {
      const transcriptData: TranscriptData = {
        content: this.transcript()
          .map(t => `${t.speaker}: ${t.text}`)
          .join('\n'),
        duration: this.timer(),
        tags: this.tags()
      };

      this.projectService.setTranscript(this.projectId(), transcriptData);
      this.projectService.updateProjectStep(this.projectId(), 'transcript');
      this.projectService.updateProjectProgress(this.projectId(), 30);
      this.router.navigate(['/projects', this.projectId(), 'transcript']);
    }
  }
}
