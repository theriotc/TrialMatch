import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrialsList } from '../trials-list/trials-list';
import { MedicalDataDisplay } from '../medical-data-display/medical-data-display';
import { ProcessingResult, MedicalData, ClinicalTrial } from '../../shared/interfaces';

@Component({
  selector: 'app-transcript-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MedicalDataDisplay, TrialsList],
  templateUrl: './transcript-upload.html',
  styleUrl: './transcript-upload.css'
})
export class TranscriptUpload {
  result = signal<ProcessingResult | null>(null);
  transcript = ''; // Has to be a regular property for ngModel to work
  isLoading = signal(false);
  errorMessage = signal('');
  
  sampleTranscript = `Doctor: Hello Ms. Johnson, thanks for coming in today. How are you feeling?

Patient: I'm okay, doctor. I've noticed I've been more thirsty than usual and peeing at night more frequently.

Doctor: Understood. Any chest pain, shortness of breath, or swelling?

Patient: No, none of that.

Doctor: Let's review your history. You are 48, have type 2 diabetes for about 8 years, and have high blood pressure, correct?

Patient: That's right. I also developed mild chronic kidney disease about a year ago — Stage 3A.

Doctor: Are you still taking your current medications?

Patient: Yes. I take metformin 1000mg twice daily and lisinopril 10mg once daily.

Doctor: Great. Your recent labs show eGFR is 55%, Hemoglobin A1C is 8.2%

Doctor: Based on this, I'll prescribe Jardiance 10mg once daily. It helps improve blood sugar control and protects your kidneys and heart.

Patient: Sounds good. I'll start that.

Doctor: Follow up in 3 months for labs and to check for side effects.`;

  constructor(private http: HttpClient) {}

  onSampleTranscript(){
    this.transcript = this.sampleTranscript;
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

    this.http.post<ProcessingResult>('/api/process-transcript', { 
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
