import { db } from '../db/database';
import type { Patient, SearchFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    return await db.patients.toArray();
  },

  async getPatientById(id: string): Promise<Patient | undefined> {
    return await db.patients.get(id);
  },

  async createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const now = new Date().toISOString();
    const patient: Patient = {
      id: uuidv4(),
      ...patientData,
      createdAt: now,
      updatedAt: now,
    };
    await db.patients.add(patient);
    return patient;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined> {
    const patient = await db.patients.get(id);
    if (!patient) return undefined;

    const updatedPatient: Patient = {
      ...patient,
      ...updates,
      id, // Ensure id doesn't change
      createdAt: patient.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    await db.patients.put(updatedPatient);
    return updatedPatient;
  },

  async deletePatient(id: string): Promise<void> {
    await db.patients.delete(id);
    // Also delete all visits for this patient
    const visits = await db.visits.where('patientId').equals(id).toArray();
    await db.visits.bulkDelete(visits.map(v => v.id));
  },

  async searchPatients(filters: SearchFilters): Promise<Patient[]> {
    let patients = await db.patients.toArray();

    // Apply search filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      patients = patients.filter(p =>
        p.firstName.toLowerCase().includes(term) ||
        p.lastName.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.dateOfBirth.includes(term)
      );
    }

    // Apply recent visits filter
    if (filters.recentVisitsOnly) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const patientIdsWithRecentVisits = new Set(
        (await db.visits
          .where('visitDate')
          .aboveOrEqual(thirtyDaysAgo.toISOString())
          .toArray()
        ).map(v => v.patientId)
      );
      patients = patients.filter(p => patientIdsWithRecentVisits.has(p.id));
    }

    // Sort
    patients.sort((a, b) => {
      const aVal = a[filters.sortField];
      const bVal = b[filters.sortField];

      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return patients;
  },

  async getRecentPatients(limit: number = 10): Promise<Patient[]> {
    return await db.patients
      .orderBy('updatedAt')
      .reverse()
      .limit(limit)
      .toArray();
  },
};
