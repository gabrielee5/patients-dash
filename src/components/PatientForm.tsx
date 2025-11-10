import React, { useState, useEffect } from 'react';
import { Button, Input } from './ui';
import type { Patient } from '../types';
import { patientService } from '../services/patientService';

interface PatientFormProps {
  patient?: Patient;
  onSave: (patient: Patient) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say' as Patient['gender'],
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bloodType: '',
    allergies: '',
    emergencyContact: '',
    emergencyPhone: '',
    insurance: '',
    insuranceId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        city: patient.city,
        state: patient.state,
        zipCode: patient.zipCode,
        bloodType: patient.bloodType || '',
        allergies: patient.allergies || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyPhone: patient.emergencyPhone || '',
        insurance: patient.insurance || '',
        insuranceId: patient.insuranceId || '',
      });
    }
  }, [patient]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSaving(true);
    try {
      let savedPatient: Patient;

      if (patient) {
        savedPatient = (await patientService.updatePatient(patient.id, formData))!;
      } else {
        savedPatient = await patientService.createPatient(formData);
      }

      onSave(savedPatient);
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Failed to save patient');
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
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name *"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={errors.firstName}
            fullWidth
          />
          <Input
            label="Last Name *"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={errors.lastName}
            fullWidth
          />
          <Input
            label="Date of Birth *"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            error={errors.dateOfBirth}
            fullWidth
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email *"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
            fullWidth
          />
          <Input
            label="Phone *"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            fullWidth
          />
          <Input
            label="Address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="md:col-span-2"
            fullWidth
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            fullWidth
          />
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            fullWidth
          />
          <Input
            label="Zip Code"
            value={formData.zipCode}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Medical Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Blood Type"
            value={formData.bloodType}
            onChange={(e) => handleChange('bloodType', e.target.value)}
            placeholder="e.g., A+"
            fullWidth
          />
          <Input
            label="Allergies"
            value={formData.allergies}
            onChange={(e) => handleChange('allergies', e.target.value)}
            placeholder="e.g., Penicillin, Peanuts"
            fullWidth
          />
        </div>
      </div>

      {/* Insurance Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Insurance Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Insurance Provider"
            value={formData.insurance}
            onChange={(e) => handleChange('insurance', e.target.value)}
            fullWidth
          />
          <Input
            label="Insurance ID"
            value={formData.insuranceId}
            onChange={(e) => handleChange('insuranceId', e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contact Name"
            value={formData.emergencyContact}
            onChange={(e) => handleChange('emergencyContact', e.target.value)}
            fullWidth
          />
          <Input
            label="Contact Phone"
            type="tel"
            value={formData.emergencyPhone}
            onChange={(e) => handleChange('emergencyPhone', e.target.value)}
            fullWidth
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Saving...' : patient ? 'Update Patient' : 'Create Patient'}
        </Button>
      </div>
    </form>
  );
};
