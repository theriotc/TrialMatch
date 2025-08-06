import { Component, signal } from '@angular/core';
import { TranscriptUpload } from './components/transcript-upload/transcript-upload';

@Component({
  selector: 'app-root',
  imports: [TranscriptUpload],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trial-match-app');
}
