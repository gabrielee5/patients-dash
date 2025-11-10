export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  insurance?: string;
  insuranceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  chiefComplaint: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
    weight?: string;
    height?: string;
  };
  examinationFindings?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  labOrders?: string;
  followUp?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitTemplate {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'follow-up' | 'urgent' | 'specialist' | 'custom';
  fields: {
    chiefComplaint?: string;
    examinationFindings?: string;
    diagnosis?: string;
    treatmentPlan?: string;
    prescriptions?: string;
    labOrders?: string;
    followUp?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  todayPatientCount: number;
  weekPatientCount: number;
  monthPatientCount: number;
  totalPatients: number;
  recentPatients: Patient[];
  todayVisits: Visit[];
}

export type SortField = 'lastName' | 'firstName' | 'dateOfBirth' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  recentVisitsOnly?: boolean;
}
