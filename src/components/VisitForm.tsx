import React, { useState, useEffect } from 'react';
import { Button, Input, TextArea } from './ui';
import type { Visit, Patient, VisitTemplate } from '../types';
import { visitService } from '../services/visitService';
import { patientService } from '../services/patientService';
import { templateService } from '../services/templateService';
import { FileText } from 'lucide-react';

interface VisitFormProps {
  visit?: Visit;
  patientId?: string;
  onSave: (visit: Visit) => void;
  onCancel: () => void;
}

export const VisitForm: React.FC<VisitFormProps> = ({
  visit,
  patientId: initialPatientId,
  onSave,
  onCancel,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [templates, setTemplates] = useState<VisitTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const [formData, setFormData] = useState({
    patientId: initialPatientId || '',
    visitDate: new Date().toISOString().slice(0, 16),
    chiefComplaint: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    examinationFindings: '',
    diagnosis: '',
    treatmentPlan: '',
    prescriptions: '',
    labOrders: '',
    followUp: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (visit) {
      setFormData({
        patientId: visit.patientId,
        visitDate: visit.visitDate.slice(0, 16),
        chiefComplaint: visit.chiefComplaint,
        bloodPressure: visit.vitalSigns?.bloodPressure || '',
        heartRate: visit.vitalSigns?.heartRate || '',
        temperature: visit.vitalSigns?.temperature || '',
        respiratoryRate: visit.vitalSigns?.respiratoryRate || '',
        oxygenSaturation: visit.vitalSigns?.oxygenSaturation || '',
        weight: visit.vitalSigns?.weight || '',
        height: visit.vitalSigns?.height || '',
        examinationFindings: visit.examinationFindings || '',
        diagnosis: visit.diagnosis || '',
        treatmentPlan: visit.treatmentPlan || '',
        prescriptions: visit.prescriptions || '',
        labOrders: visit.labOrders || '',
        followUp: visit.followUp || '',
        notes: visit.notes || '',
      });
    }
  }, [visit]);

  const loadData = async () => {
    const [patientsData, templatesData] = await Promise.all([
      patientService.getAllPatients(),
      templateService.getAllTemplates(),
    ]);
    setPatients(patientsData);
    setTemplates(templatesData);
  };

  const handleTemplateSelect = async (templateId: string) => {
    setSelectedTemplate(templateId);
    if (!templateId) return;

    const template = await templateService.getTemplateById(templateId);
    if (template) {
      setFormData((prev) => ({
        ...prev,
        chiefComplaint: template.fields.chiefComplaint || prev.chiefComplaint,
        examinationFindings: template.fields.examinationFindings || prev.examinationFindings,
        diagnosis: template.fields.diagnosis || prev.diagnosis,
        treatmentPlan: template.fields.treatmentPlan || prev.treatmentPlan,
        prescriptions: template.fields.prescriptions || prev.prescriptions,
        labOrders: template.fields.labOrders || prev.labOrders,
        followUp: template.fields.followUp || prev.followUp,
        notes: template.fields.notes || prev.notes,
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) newErrors.patientId = 'Patient is required';
    if (!formData.chiefComplaint.trim())
      newErrors.chiefComplaint = 'Chief complaint is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      const visitData = {
        patientId: formData.patientId,
        visitDate: new Date(formData.visitDate).toISOString(),
        chiefComplaint: formData.chiefComplaint,
        vitalSigns: {
          bloodPressure: formData.bloodPressure,
          heartRate: formData.heartRate,
          temperature: formData.temperature,
          respiratoryRate: formData.respiratoryRate,
          oxygenSaturation: formData.oxygenSaturation,
          weight: formData.weight,
          height: formData.height,
        },
        examinationFindings: formData.examinationFindings,
        diagnosis: formData.diagnosis,
        treatmentPlan: formData.treatmentPlan,
        prescriptions: formData.prescriptions,
        labOrders: formData.labOrders,
        followUp: formData.followUp,
        notes: formData.notes,
      };

      let savedVisit: Visit;
      if (visit) {
        savedVisit = (await visitService.updateVisit(visit.id, visitData))!;
      } else {
        savedVisit = await visitService.createVisit(visitData);
      }

      onSave(savedVisit);
    } catch (error) {
      console.error('Error saving visit:', error);
      alert('Failed to save visit');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient and Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient *
          </label>
          <select
            value={formData.patientId}
            onChange={(e) => handleChange('patientId', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            disabled={!!initialPatientId}
          >
            <option value="">Select a patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.firstName} {patient.lastName}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.patientId}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Use Template
          </label>
          <div className="relative">
            <FileText
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="">No template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Input
        label="Visit Date & Time *"
        type="datetime-local"
        value={formData.visitDate}
        onChange={(e) => handleChange('visitDate', e.target.value)}
        fullWidth
      />

      {/* Chief Complaint */}
      <TextArea
        label="Chief Complaint *"
        value={formData.chiefComplaint}
        onChange={(e) => handleChange('chiefComplaint', e.target.value)}
        error={errors.chiefComplaint}
        rows={2}
        fullWidth
      />

      {/* Vital Signs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Vital Signs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label="Blood Pressure"
            value={formData.bloodPressure}
            onChange={(e) => handleChange('bloodPressure', e.target.value)}
            placeholder="120/80"
            fullWidth
          />
          <Input
            label="Heart Rate"
            value={formData.heartRate}
            onChange={(e) => handleChange('heartRate', e.target.value)}
            placeholder="72 bpm"
            fullWidth
          />
          <Input
            label="Temperature"
            value={formData.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
            placeholder="98.6°F"
            fullWidth
          />
          <Input
            label="Respiratory Rate"
            value={formData.respiratoryRate}
            onChange={(e) => handleChange('respiratoryRate', e.target.value)}
            placeholder="16/min"
            fullWidth
          />
          <Input
            label="O₂ Saturation"
            value={formData.oxygenSaturation}
            onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
            placeholder="98%"
            fullWidth
          />
          <Input
            label="Weight"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            placeholder="150 lbs"
            fullWidth
          />
          <Input
            label="Height"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            placeholder="68 in"
            fullWidth
          />
        </div>
      </div>

      {/* Clinical Notes */}
      <div className="space-y-4">
        <TextArea
          label="Examination Findings"
          value={formData.examinationFindings}
          onChange={(e) => handleChange('examinationFindings', e.target.value)}
          rows={4}
          fullWidth
        />

        <TextArea
          label="Diagnosis"
          value={formData.diagnosis}
          onChange={(e) => handleChange('diagnosis', e.target.value)}
          rows={3}
          fullWidth
        />

        <TextArea
          label="Treatment Plan"
          value={formData.treatmentPlan}
          onChange={(e) => handleChange('treatmentPlan', e.target.value)}
          rows={4}
          fullWidth
        />

        <TextArea
          label="Prescriptions"
          value={formData.prescriptions}
          onChange={(e) => handleChange('prescriptions', e.target.value)}
          rows={3}
          fullWidth
        />

        <TextArea
          label="Lab Orders"
          value={formData.labOrders}
          onChange={(e) => handleChange('labOrders', e.target.value)}
          rows={2}
          fullWidth
        />

        <TextArea
          label="Follow-up"
          value={formData.followUp}
          onChange={(e) => handleChange('followUp', e.target.value)}
          rows={2}
          fullWidth
        />

        <TextArea
          label="Additional Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          fullWidth
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : visit ? 'Update Visit' : 'Record Visit'}
        </Button>
      </div>
    </form>
  );
};
