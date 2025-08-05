import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptUpload } from './transcript-upload';

describe('TranscriptUpload', () => {
  let component: TranscriptUpload;
  let fixture: ComponentFixture<TranscriptUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranscriptUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranscriptUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
