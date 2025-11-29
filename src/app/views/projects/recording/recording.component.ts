import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  CardComponent, CardBodyComponent, CardHeaderComponent,
  ButtonDirective, GridModule, BadgeComponent, ProgressComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-recording',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent, CardBodyComponent, CardHeaderComponent,
    ButtonDirective, GridModule, BadgeComponent, ProgressComponent,
    IconDirective
  ],
  template: `
    <c-row>
      <c-col xs="12">
        <c-card class="mb-4">
          <c-card-header>
            <strong>Step 3: Recording & Transcription</strong>
          </c-card-header>
          <c-card-body>
            <div class="text-center mb-4">
              <h1 class="display-1">{{ formatTime(timer) }}</h1>
              <div class="d-flex justify-content-center gap-3 mt-3">
                <button cButton [color]="isRecording ? 'warning' : 'success'" (click)="toggleRecording()">
                  <svg cIcon class="me-2" [name]="isRecording ? 'cilPause' : 'cilMediaPlay'"></svg>
                  {{ isRecording ? 'Pause' : 'Resume' }}
                </button>
                <button cButton color="danger" (click)="finishRecording()">
                  <svg cIcon class="me-2" name="cilMediaStop"></svg>
                  Stop & Transcribe
                </button>
              </div>
            </div>

            <c-row>
              <c-col md="8" class="mx-auto">
                <c-card class="bg-light border-0">
                  <c-card-body style="height: 300px; overflow-y: auto;">
                    @for (line of transcript; track line.time) {
                      <div class="mb-3">
                        <small class="text-muted">{{ line.time }} - {{ line.speaker }}</small>
                        <p class="mb-1">{{ line.text }}</p>
                      </div>
                    }
                    @if (transcript.length === 0) {
                      <div class="text-center text-muted mt-5">
                        <em>Recording started... Waiting for speech...</em>
                      </div>
                    }
                  </c-card-body>
                </c-card>

                <div class="mt-3 d-flex gap-2 justify-content-center">
                  <button cButton color="info" variant="outline" size="sm">
                    <svg cIcon class="me-1" name="cilTag"></svg> Pain Point
                  </button>
                  <button cButton color="success" variant="outline" size="sm">
                    <svg cIcon class="me-1" name="cilTag"></svg> Opportunity
                  </button>
                  <button cButton color="warning" variant="outline" size="sm">
                    <svg cIcon class="me-1" name="cilTag"></svg> Insight
                  </button>
                </div>
              </c-col>
            </c-row>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `
})
export class RecordingComponent implements OnInit, OnDestroy {
  private router = inject(Router);

  isRecording = false;
  timer = 0;
  intervalId: any;

  transcript: { speaker: string, text: string, time: string }[] = [];

  mockDialogue = [
    "So, tell me about your main challenges.",
    "Well, we are struggling with customer retention.",
    "Interesting. Is it across all segments?",
    "Mostly in the enterprise segment.",
    "I see. Have you tried any loyalty programs?",
    "We have, but adoption is low.",
    "What kind of feedback are you getting?",
    "They say the onboarding is too complex."
  ];

  ngOnInit() {
    this.startRecording();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }

  startRecording() {
    this.isRecording = true;
    this.startTimer();
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timer++;
      if (this.timer % 3 === 0 && this.transcript.length < this.mockDialogue.length) {
        this.addMockTranscript();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.intervalId);
  }

  addMockTranscript() {
    const index = this.transcript.length;
    const speaker = index % 2 === 0 ? 'Consultant' : 'Client';
    this.transcript.push({
      speaker,
      text: this.mockDialogue[index],
      time: this.formatTime(this.timer)
    });
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  finishRecording() {
    this.stopTimer();
    this.router.navigate(['/projects', '1', 'transcript']);
  }
}
