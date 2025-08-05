import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranscriptUpload } from './components/transcript-upload/transcript-upload';
import { MedicalDataDisplay } from './components/medical-data-display/medical-data-display';
import { TrialDetail } from './components/trial-detail/trial-detail';
import { TrialsList } from './components/trials-list/trials-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranscriptUpload, MedicalDataDisplay, TrialsList, TrialDetail],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trial-match-app');
}
