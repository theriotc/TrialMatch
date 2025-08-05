import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TrialsList } from '../trials-list/trials-list';
import { MedicalDataDisplay } from '../medical-data-display/medical-data-display';

export interface ProcessingResult {
  medical_data: {
    normalized: MedicalData;
    raw: MedicalData;
  };
  trials: {
    studies?: ClinicalTrial[] | null;
  };
}

export interface MedicalData {
  age: number;
  comorbidities: string[];
  current_medications: string[];
  intervention_interest: string;
  primary_condition: string;
  sex: string;
}

export interface ClinicalTrial {
  protocolSection:{
    identificationModule:{
      briefTitle: string;
      nctId: string;
    }
  }
}

@Component({
  selector: 'app-transcript-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MedicalDataDisplay, TrialsList],
  templateUrl: './transcript-upload.html',
  styleUrl: './transcript-upload.css'
})
export class TranscriptUpload {
  result: ProcessingResult | null = null;
  transcript = '';
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
  }

  onUploadTranscript(){
    this.http.post<ProcessingResult>('http://localhost:5000/api/process-transcript', { transcript: this.transcript })
      .subscribe((res: any) => {
        console.log(res);
        this.result = res;
    });
  }
}
