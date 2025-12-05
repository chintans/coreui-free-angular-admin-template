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
  templateUrl: './recording.component.html'
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
