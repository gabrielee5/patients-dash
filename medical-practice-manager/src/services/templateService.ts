import { db } from '../db/database';
import type { VisitTemplate } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const templateService = {
  async getAllTemplates(): Promise<VisitTemplate[]> {
    return await db.templates.toArray();
  },

  async getTemplateById(id: string): Promise<VisitTemplate | undefined> {
    return await db.templates.get(id);
  },

  async getTemplatesByCategory(category: VisitTemplate['category']): Promise<VisitTemplate[]> {
    return await db.templates.where('category').equals(category).toArray();
  },

  async createTemplate(
    templateData: Omit<VisitTemplate, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<VisitTemplate> {
    const now = new Date().toISOString();
    const template: VisitTemplate = {
      id: uuidv4(),
      ...templateData,
      createdAt: now,
      updatedAt: now,
    };
    await db.templates.add(template);
    return template;
  },

  async updateTemplate(
    id: string,
    updates: Partial<VisitTemplate>
  ): Promise<VisitTemplate | undefined> {
    const template = await db.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate: VisitTemplate = {
      ...template,
      ...updates,
      id, // Ensure id doesn't change
      createdAt: template.createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(),
    };

    await db.templates.put(updatedTemplate);
    return updatedTemplate;
  },

  async deleteTemplate(id: string): Promise<void> {
    await db.templates.delete(id);
  },

  async initializeDefaultTemplates(): Promise<void> {
    const existingTemplates = await db.templates.toArray();
    if (existingTemplates.length > 0) return; // Already initialized

    const defaultTemplates: Omit<VisitTemplate, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'General Check-up',
        description: 'Standard annual physical examination',
        category: 'general',
        fields: {
          chiefComplaint: 'Annual physical examination',
          examinationFindings: 'General appearance: \nVital signs: \nCardiovascular: \nRespiratory: \nAbdomen: \nNeurological: ',
          treatmentPlan: 'Continue current medications\nHealthy lifestyle recommendations',
          followUp: 'Return in 12 months for annual check-up',
        },
      },
      {
        name: 'Follow-up Visit',
        description: 'Standard follow-up appointment',
        category: 'follow-up',
        fields: {
          chiefComplaint: 'Follow-up visit',
          examinationFindings: 'Patient reports: \nProgress since last visit: ',
          treatmentPlan: 'Continue current treatment plan',
          followUp: 'Follow-up in 2-4 weeks',
        },
      },
      {
        name: 'Urgent Care',
        description: 'Template for urgent medical concerns',
        category: 'urgent',
        fields: {
          chiefComplaint: '',
          examinationFindings: 'Chief complaint: \nOnset: \nSeverity: \nPhysical examination: ',
          diagnosis: '',
          treatmentPlan: 'Immediate: \nPrescriptions: ',
          followUp: 'Follow-up in 24-48 hours or sooner if symptoms worsen',
        },
      },
      {
        name: 'Specialist Consultation',
        description: 'Initial specialist consultation',
        category: 'specialist',
        fields: {
          chiefComplaint: 'Referred by: \nReason for referral: ',
          examinationFindings: 'History of present illness: \nRelevant medical history: \nPhysical examination: ',
          diagnosis: 'Assessment: ',
          treatmentPlan: 'Recommendations: ',
          labOrders: 'Additional tests ordered: ',
          followUp: 'Follow-up as needed',
        },
      },
    ];

    for (const template of defaultTemplates) {
      await this.createTemplate(template);
    }
  },
};
