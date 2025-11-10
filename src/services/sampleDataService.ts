import type { Patient, Visit } from '../types';
import { patientService } from './patientService';
import { visitService } from './visitService';
import { templateService } from './templateService';
import { db } from '../db/database';
import { subDays } from 'date-fns';

const generateSamplePatients = (): Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] => [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-15',
    gender: 'female',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    bloodType: 'A+',
    allergies: 'Penicillin, Peanuts',
    emergencyContact: 'Michael Johnson',
    emergencyPhone: '(555) 123-4568',
    insurance: 'Blue Cross Blue Shield',
    insuranceId: 'BC123456789',
  },
  {
    firstName: 'Robert',
    lastName: 'Chen',
    dateOfBirth: '1978-07-22',
    gender: 'male',
    email: 'robert.chen@email.com',
    phone: '(555) 234-5678',
    address: '456 Oak Avenue',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62702',
    bloodType: 'O-',
    allergies: 'None',
    emergencyContact: 'Lisa Chen',
    emergencyPhone: '(555) 234-5679',
    insurance: 'United Healthcare',
    insuranceId: 'UH987654321',
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1992-11-08',
    gender: 'female',
    email: 'maria.garcia@email.com',
    phone: '(555) 345-6789',
    address: '789 Elm Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62703',
    bloodType: 'B+',
    emergencyContact: 'Carlos Garcia',
    emergencyPhone: '(555) 345-6790',
    insurance: 'Aetna',
    insuranceId: 'AE456789123',
  },
  {
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: '1965-05-30',
    gender: 'male',
    email: 'james.wilson@email.com',
    phone: '(555) 456-7890',
    address: '321 Pine Road',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62704',
    bloodType: 'AB+',
    allergies: 'Sulfa drugs',
    emergencyContact: 'Patricia Wilson',
    emergencyPhone: '(555) 456-7891',
    insurance: 'Cigna',
    insuranceId: 'CI789123456',
  },
  {
    firstName: 'Emily',
    lastName: 'Taylor',
    dateOfBirth: '1988-09-12',
    gender: 'female',
    email: 'emily.taylor@email.com',
    phone: '(555) 567-8901',
    address: '654 Maple Drive',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62705',
    bloodType: 'A-',
    emergencyContact: 'David Taylor',
    emergencyPhone: '(555) 567-8902',
    insurance: 'Blue Cross Blue Shield',
    insuranceId: 'BC321654987',
  },
  {
    firstName: 'Michael',
    lastName: 'Anderson',
    dateOfBirth: '1975-02-28',
    gender: 'male',
    email: 'michael.anderson@email.com',
    phone: '(555) 678-9012',
    address: '987 Cedar Lane',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62706',
    bloodType: 'O+',
    allergies: 'Latex',
    emergencyContact: 'Jennifer Anderson',
    emergencyPhone: '(555) 678-9013',
    insurance: 'United Healthcare',
    insuranceId: 'UH654987321',
  },
  {
    firstName: 'Linda',
    lastName: 'Martinez',
    dateOfBirth: '1970-12-05',
    gender: 'female',
    email: 'linda.martinez@email.com',
    phone: '(555) 789-0123',
    address: '159 Birch Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62707',
    bloodType: 'B-',
    emergencyContact: 'Jose Martinez',
    emergencyPhone: '(555) 789-0124',
    insurance: 'Aetna',
    insuranceId: 'AE159753486',
  },
  {
    firstName: 'David',
    lastName: 'Thompson',
    dateOfBirth: '1995-06-18',
    gender: 'male',
    email: 'david.thompson@email.com',
    phone: '(555) 890-1234',
    address: '753 Willow Court',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62708',
    emergencyContact: 'Susan Thompson',
    emergencyPhone: '(555) 890-1235',
    insurance: 'Cigna',
    insuranceId: 'CI753159486',
  },
];

const generateVisitsForPatient = (
  patientId: string
): Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const visits: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  const visitCount = Math.floor(Math.random() * 5) + 2; // 2-6 visits per patient

  for (let i = 0; i < visitCount; i++) {
    const daysAgo = Math.floor(Math.random() * 365) + (i * 30);
    const visitDate = subDays(new Date(), daysAgo);

    const complaints = [
      'Annual physical examination',
      'Follow-up for hypertension',
      'Upper respiratory infection symptoms',
      'Routine check-up',
      'Abdominal pain',
      'Back pain',
      'Headaches',
      'Fatigue and weakness',
      'Diabetes management',
      'Skin rash',
    ];

    const diagnoses = [
      'Hypertension, controlled',
      'Type 2 Diabetes Mellitus',
      'Upper Respiratory Infection',
      'Normal examination',
      'Gastroesophageal Reflux Disease',
      'Musculoskeletal strain',
      'Tension headache',
      'Vitamin D deficiency',
      'Allergic rhinitis',
      'Contact dermatitis',
    ];

    visits.push({
      patientId,
      visitDate: visitDate.toISOString(),
      chiefComplaint: complaints[Math.floor(Math.random() * complaints.length)],
      vitalSigns: {
        bloodPressure: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
        heartRate: `${60 + Math.floor(Math.random() * 40)}`,
        temperature: `${97 + Math.random() * 2.5}`,
        respiratoryRate: `${14 + Math.floor(Math.random() * 8)}`,
        oxygenSaturation: `${96 + Math.floor(Math.random() * 4)}`,
        weight: `${140 + Math.floor(Math.random() * 60)} lbs`,
        height: `${64 + Math.floor(Math.random() * 12)} in`,
      },
      examinationFindings:
        'General appearance: Well-developed, well-nourished, in no acute distress.\nHEENT: Normocephalic, atraumatic. Pupils equal, round, and reactive to light.\nCardiovascular: Regular rate and rhythm, no murmurs.\nRespiratory: Clear to auscultation bilaterally.\nAbdomen: Soft, non-tender, non-distended.',
      diagnosis: diagnoses[Math.floor(Math.random() * diagnoses.length)],
      treatmentPlan: 'Continue current medications. Lifestyle modifications recommended. Monitor symptoms.',
      prescriptions: i % 2 === 0 ? 'Lisinopril 10mg daily\nMetformin 500mg twice daily' : undefined,
      followUp: i === 0 ? 'Follow-up in 2 weeks' : 'Follow-up in 3 months or as needed',
      notes: 'Patient is compliant with treatment. Condition stable.',
    });
  }

  return visits;
};

export const sampleDataService = {
  async initializeSampleData(): Promise<void> {
    // Check if data already exists
    const existingPatients = await db.patients.toArray();
    if (existingPatients.length > 0) {
      console.log('Sample data already exists, skipping initialization');
      return;
    }

    console.log('Initializing sample data...');

    // Initialize templates
    await templateService.initializeDefaultTemplates();

    // Create sample patients
    const samplePatients = generateSamplePatients();
    const createdPatients: Patient[] = [];

    for (const patientData of samplePatients) {
      const patient = await patientService.createPatient(patientData);
      createdPatients.push(patient);
    }

    // Create visits for each patient
    for (const patient of createdPatients) {
      const visits = generateVisitsForPatient(patient.id);

      for (const visitData of visits) {
        await visitService.createVisit(visitData);
      }
    }

    console.log('Sample data initialized successfully');
  },

  async clearAllData(): Promise<void> {
    await db.patients.clear();
    await db.visits.clear();
    await db.templates.clear();
    console.log('All data cleared');
  },

  async resetData(): Promise<void> {
    await this.clearAllData();
    await this.initializeSampleData();
    console.log('Data reset complete');
  },
};
