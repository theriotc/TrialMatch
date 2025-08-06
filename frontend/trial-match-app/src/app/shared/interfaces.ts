export interface MedicalData {
  age: number;
  comorbidities: string[];
  current_medications: string[];
  intervention_interest: string;
  primary_condition: string;
  sex: string;
}

export interface ProcessingResult {
  medical_data: {
    normalized: MedicalData;
    raw: MedicalData;
  };
  trials: {
    studies?: ClinicalTrial[] | null;
  };
}

export interface ClinicalTrial {
  protocolSection: {
    identificationModule: {
      briefTitle: string;
      nctId: string;
    };
    statusModule?: {
      overallStatus?: string;
      startDateStruct?: {
        date?: string;
      };
    };
    designModule?: {
      enrollmentInfo?: {
        count?: number;
      };
    };
  };
}

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