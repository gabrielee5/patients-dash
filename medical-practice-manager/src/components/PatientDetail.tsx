import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Edit,
  FileText,
  Download,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { Button, Card, CardHeader, CardContent, Modal } from './ui';
import type { Patient, Visit } from '../types';
import { patientService } from '../services/patientService';
import { visitService } from '../services/visitService';
import { exportService } from '../services/exportService';
import { format } from 'date-fns';
import { PatientForm } from './PatientForm';
import { VisitForm } from './VisitForm';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
  onPatientUpdated: () => void;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({
  patientId,
  onBack,
  onPatientUpdated,
}) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | undefined>();
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [patientData, visitsData] = await Promise.all([
        patientService.getPatientById(patientId),
        visitService.getVisitsByPatientId(patientId),
      ]);

      if (patientData) {
        setPatient(patientData);
        setVisits(visitsData);
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (patient) {
      await exportService.exportPatientToPDF(patient, visits);
    }
  };

  const handleExportCSV = async () => {
    if (patient) {
      await exportService.exportPatientVisitsToCSV(patientId, patient);
    }
  };

  const handlePatientSaved = () => {
    setEditModalOpen(false);
    loadPatientData();
    onPatientUpdated();
  };

  const handleVisitSaved = () => {
    setVisitModalOpen(false);
    setSelectedVisit(undefined);
    loadPatientData();
  };

  const handleNewVisit = () => {
    setSelectedVisit(undefined);
    setVisitModalOpen(true);
  };

  const handleEditVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setVisitModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading patient...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Patient not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {patient.firstName} {patient.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Patient ID: {patient.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(true)}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportPDF}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleNewVisit}>
            <FileText size={16} className="mr-2" />
            New Visit
          </Button>
        </div>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <User size={20} className="mr-2" />
              Personal Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Date of Birth</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Gender</p>
              <p className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                {patient.gender}
              </p>
            </div>
            {patient.bloodType && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                  <Heart size={14} className="mr-1" />
                  Blood Type
                </p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {patient.bloodType}
                </p>
              </div>
            )}
            {patient.allergies && (
              <div>
                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  Allergies
                </p>
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {patient.allergies}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Phone size={20} className="mr-2" />
              Contact Information
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <Mail size={14} className="mr-1" />
                Email
              </p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {patient.email}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <Phone size={14} className="mr-1" />
                Phone
              </p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {patient.phone}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin size={14} className="mr-1" />
                Address
              </p>
              <p className="text-gray-900 dark:text-gray-100 font-medium">
                {patient.address}
                <br />
                {patient.city}, {patient.state} {patient.zipCode}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Insurance & Emergency */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Shield size={20} className="mr-2" />
              Insurance & Emergency
            </h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {patient.insurance && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Insurance</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {patient.insurance}
                </p>
                {patient.insuranceId && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    ID: {patient.insuranceId}
                  </p>
                )}
              </div>
            )}
            {patient.emergencyContact && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Emergency Contact</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {patient.emergencyContact}
                </p>
                {patient.emergencyPhone && (
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {patient.emergencyPhone}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visit History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Calendar size={20} className="mr-2" />
              Visit History ({visits.length})
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 dark:text-gray-600 mb-2" size={48} />
              <p className="text-gray-500 dark:text-gray-400">No visits recorded yet</p>
              <Button variant="primary" size="sm" className="mt-4" onClick={handleNewVisit}>
                Record First Visit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <div
                  key={visit.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <div
                    className="p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() =>
                      setExpandedVisit(expandedVisit === visit.id ? null : visit.id)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {format(new Date(visit.visitDate), 'MMMM dd, yyyy • HH:mm')}
                          </p>
                          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                            {visit.chiefComplaint}
                          </span>
                        </div>
                        {visit.diagnosis && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Diagnosis: {visit.diagnosis}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVisit(visit);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                    </div>
                  </div>

                  {expandedVisit === visit.id && (
                    <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
                      {/* Vital Signs */}
                      {visit.vitalSigns && Object.values(visit.vitalSigns).some(Boolean) && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Vital Signs
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            {visit.vitalSigns.bloodPressure && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">BP</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  {visit.vitalSigns.bloodPressure}
                                </p>
                              </div>
                            )}
                            {visit.vitalSigns.heartRate && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">HR</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  {visit.vitalSigns.heartRate}
                                </p>
                              </div>
                            )}
                            {visit.vitalSigns.temperature && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Temp</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  {visit.vitalSigns.temperature}°F
                                </p>
                              </div>
                            )}
                            {visit.vitalSigns.oxygenSaturation && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">O₂ Sat</p>
                                <p className="text-gray-900 dark:text-gray-100">
                                  {visit.vitalSigns.oxygenSaturation}%
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {visit.examinationFindings && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Examination Findings
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {visit.examinationFindings}
                          </p>
                        </div>
                      )}

                      {visit.treatmentPlan && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Treatment Plan
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {visit.treatmentPlan}
                          </p>
                        </div>
                      )}

                      {visit.prescriptions && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Prescriptions
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {visit.prescriptions}
                          </p>
                        </div>
                      )}

                      {visit.followUp && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Follow-up
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {visit.followUp}
                          </p>
                        </div>
                      )}

                      {visit.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Additional Notes
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {visit.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Patient"
        size="lg"
      >
        <PatientForm
          patient={patient}
          onSave={handlePatientSaved}
          onCancel={() => setEditModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={visitModalOpen}
        onClose={() => {
          setVisitModalOpen(false);
          setSelectedVisit(undefined);
        }}
        title={selectedVisit ? 'Edit Visit' : 'New Visit'}
        size="xl"
      >
        <VisitForm
          visit={selectedVisit}
          patientId={patientId}
          onSave={handleVisitSaved}
          onCancel={() => {
            setVisitModalOpen(false);
            setSelectedVisit(undefined);
          }}
        />
      </Modal>
    </div>
  );
};
