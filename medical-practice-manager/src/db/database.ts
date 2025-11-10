import Dexie, { type Table } from 'dexie';
import type { Patient, Visit, VisitTemplate } from '../types';

export class MedicalPracticeDB extends Dexie {
  patients!: Table<Patient, string>;
  visits!: Table<Visit, string>;
  templates!: Table<VisitTemplate, string>;

  constructor() {
    super('MedicalPracticeDB');

    this.version(1).stores({
      patients: 'id, firstName, lastName, dateOfBirth, email, phone, createdAt, updatedAt',
      visits: 'id, patientId, visitDate, createdAt, updatedAt',
      templates: 'id, name, category, createdAt'
    });
  }
}

export const db = new MedicalPracticeDB();
