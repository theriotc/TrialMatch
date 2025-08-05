import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalDataDisplay } from './medical-data-display';

describe('MedicalDataDisplay', () => {
  let component: MedicalDataDisplay;
  let fixture: ComponentFixture<MedicalDataDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalDataDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalDataDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
