import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrialsList } from '../trials-list/trials-list';
import { MedicalDataDisplay } from '../medical-data-display/medical-data-display';
import { ProcessingResult, MedicalData, ClinicalTrial } from '../../shared/interfaces';
import { environment } from '../../../environments/environment';
import { SAMPLE_TRANSCRIPTS, SampleTranscript } from '../../shared/sample-transcripts';

@Component({
  selector: 'app-transcript-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MedicalDataDisplay, TrialsList],
  templateUrl: './transcript-upload.html',
  styleUrl: './transcript-upload.css'
})
export class TranscriptUpload {
  result = signal<ProcessingResult | null>(null);
  transcript = '';
  isLoading = signal(false);
  errorMessage = signal('');
  
  currentSampleIndex = signal(0);
  sampleTranscripts = SAMPLE_TRANSCRIPTS;

  constructor(private http: HttpClient) {}

  get currentSample(): SampleTranscript {
    return this.sampleTranscripts[this.currentSampleIndex()];
  }

  onSampleTranscript(){
    this.transcript = this.currentSample.transcript;
    // Cycle to next sample for next click
    const nextIndex = (this.currentSampleIndex() + 1) % this.sampleTranscripts.length;
    this.currentSampleIndex.set(nextIndex);
  }

  onClearTranscript(){
    this.transcript = '';
    this.result.set(null);
    this.errorMessage.set('');
  }

  onUploadTranscript(){
    if (!this.transcript) {
      this.errorMessage.set('Please enter a transcript first.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);

    this.http.post<ProcessingResult>(`${environment.apiUrl}/api/process-transcript`, { 
      transcript: this.transcript 
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.result.set(res);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error processing transcript:', error);
        const errorMsg = error.error?.error || error.message || 'Error processing transcript. Please try again.';
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }
}
