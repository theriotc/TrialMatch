import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicalData } from '../transcript-upload/transcript-upload';

@Component({
  selector: 'app-medical-data-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './medical-data-display.html',
  styleUrl: './medical-data-display.css'
})
export class MedicalDataDisplay {
  @Input() medicalData: MedicalData | null = null;
}
