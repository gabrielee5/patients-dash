import { db } from '../db/database';
import type { Visit } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay, endOfDay, subDays } from 'date-fns';

export const visitService = {
  async getAllVisits(): Promise<Visit[]> {
    return await db.visits.toArray();
  },

  async getVisitById(id: string): Promise<Visit | undefined> {
    return await db.visits.get(id);
  },

  async getVisitsByPatientId(patientId: string): Promise<Visit[]> {
    return await db.visits
      .where('patientId')
      .equals(patientId)
      .reverse()
      .sortBy('visitDate');
  },

  async createVisit(visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Visit> {
    const now = new Date().toISOString();
    const visit: Visit = {
      id: uuidv4(),
      ...visitData,
      createdAt: now,
      updatedAt: now,
    };
    await db.visits.add(visit);

    // Update patient's updatedAt
    const patient = await db.patients.get(visitData.patientId);
    if (patient) {
      await db.patients.put({ ...patient, updatedAt: now });
    }

    return visit;
  },

  async updateVisit(id: string, updates: Partial<Visit>): Promise<Visit | undefined> {
    const visit = await db.visits.get(id);
    if (!visit) return undefined;

    const updatedVisit: Visit = {
      ...visit,
      ...updates,
      id, // Ensure id doesn't change
      patientId: visit.patientId, // Preserve patientId
      createdAt: visit.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    await db.visits.put(updatedVisit);
    return updatedVisit;
  },

  async deleteVisit(id: string): Promise<void> {
    await db.visits.delete(id);
  },

  async getTodayVisits(): Promise<Visit[]> {
    const today = new Date();
    const startOfToday = startOfDay(today).toISOString();
    const endOfToday = endOfDay(today).toISOString();

    return await db.visits
      .where('visitDate')
      .between(startOfToday, endOfToday, true, true)
      .reverse()
      .sortBy('visitDate');
  },

  async getVisitsInDateRange(startDate: Date, endDate: Date): Promise<Visit[]> {
    return await db.visits
      .where('visitDate')
      .between(startDate.toISOString(), endDate.toISOString(), true, true)
      .reverse()
      .sortBy('visitDate');
  },

  async getRecentVisits(days: number = 7): Promise<Visit[]> {
    const startDate = subDays(new Date(), days);
    return await this.getVisitsInDateRange(startDate, new Date());
  },
};
