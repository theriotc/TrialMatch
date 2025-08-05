import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranscriptUpload } from './components/transcript-upload/transcript-upload';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranscriptUpload],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('trial-match-app');
}
