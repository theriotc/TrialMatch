import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface TrialDetail {
  hasResults: boolean;
  protocolSection: {
    designModule: {
      enrollmentInfo: {
        count: number;
        type: string;
      };
      studyType: string;
    };
    eligibilityModule: {
      minimumAge: string;
      sex: string;
    };
    identificationModule: {
      briefTitle: string;
      nctId: string;
    };
    statusModule: {
      completionDateStruct: {
        date: string;
      };
      overallStatus: string;
      startDateStruct: {
        date: string;
      };
    };
  };
}

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
  
  trialDetail = signal<TrialDetail | null>(null);
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Initial fetch if nctId is already set
    if (this.nctId) {
      this.fetchTrialDetail(this.nctId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nctId'] && changes['nctId'].currentValue) {
      this.fetchTrialDetail(changes['nctId'].currentValue);
    }
  }

  fetchTrialDetail(nctId: string) {
    this.isLoading.set(true);
    this.error.set(null);
    this.trialDetail.set(null);

    this.http.get<TrialDetail>(`http://localhost:5000/api/trial/${nctId}`)
      .subscribe({
        next: (res) => {
          console.log('Trial detail response:', res);
          this.trialDetail.set(res);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching trial detail:', error);
          this.error.set('Failed to load trial details');
          this.isLoading.set(false);
        }
      });
  }
} 
