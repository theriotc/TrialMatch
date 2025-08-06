import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TrialDetail as TrialDetailInterface } from '../../shared/interfaces';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-trial-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trial-detail.html',
  styleUrl: './trial-detail.css'
})
export class TrialDetail implements OnInit, OnChanges {
  @Input() nctId: string | null = null;
  @Input() briefTitle: string | null = null;
  
  trialDetail = signal<TrialDetailInterface | null>(null);
  trialResultsSummary = signal<string | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);
  isLoadingResults = signal(false);
  private lastNctId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.nctId && this.nctId !== this.lastNctId) {
      this.fetchTrialDetail(this.nctId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nctId'] && changes['nctId'].currentValue && changes['nctId'].currentValue !== this.lastNctId) {
      this.fetchTrialDetail(changes['nctId'].currentValue);
    }
  }

  fetchTrialDetail(nctId: string) {
    if (nctId === this.lastNctId) {
      return;
    }
    
    this.lastNctId = nctId;
    this.isLoading.set(true);
    this.error.set(null);
    this.trialDetail.set(null);
    this.trialResultsSummary.set(null);

    this.http.get<TrialDetailInterface>(`${environment.apiUrl}/api/trial/${nctId}`)
      .subscribe({
        next: (res) => {
          console.log('Trial detail response:', res);
          this.trialDetail.set(res);
          this.isLoading.set(false);
          
          if (res.hasResults) {
            this.fetchTrialResults(nctId);
          }
        },
        error: (error) => {
          console.error('Error fetching trial detail:', error);
          this.error.set('Failed to load trial details');
          this.isLoading.set(false);
        }
      });
  }

  fetchTrialResults(nctId: string) {
    this.isLoadingResults.set(true);
    
    this.http.get(`${environment.apiUrl}/api/results/${nctId}`, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          console.log('Trial results response:', res);
          this.trialResultsSummary.set(res);
          this.isLoadingResults.set(false);
        },
        error: (error) => {
          console.error('Error fetching trial results:', error);
          this.isLoadingResults.set(false);
        }
      });
  }
} 
