import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClinicalTrial } from '../transcript-upload/transcript-upload';
import { TrialDetail } from '../trial-detail/trial-detail';

@Component({
  selector: 'app-trials-list',
  imports: [CommonModule, TrialDetail],
  templateUrl: './trials-list.html',
  styleUrl: './trials-list.css'
})
export class TrialsList {
  @Input() trials: ClinicalTrial[] = [];
}
