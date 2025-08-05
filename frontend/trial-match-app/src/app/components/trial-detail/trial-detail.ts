import { Component, Input } from '@angular/core';
import { ClinicalTrial } from '../transcript-upload/transcript-upload';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trial-detail',
  imports: [CommonModule],
  templateUrl: './trial-detail.html',
  styleUrl: './trial-detail.css'
})
export class TrialDetail {
  @Input() nctId: string | null = null;
  @Input() briefTitle: string | null = null;
} 
