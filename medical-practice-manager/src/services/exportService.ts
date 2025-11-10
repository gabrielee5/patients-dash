import type { Patient, Visit } from '../types';
import jsPDF from 'jspdf';
import Papa from 'papaparse';
import { format } from 'date-fns';
import { visitService } from './visitService';

export const exportService = {
  async exportPatientToPDF(patient: Patient, visits: Visit[]): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.text('Patient Medical Record', margin, yPosition);
    yPosition += 10;

    // Patient Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', margin, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const patientInfo = [
      `Name: ${patient.firstName} ${patient.lastName}`,
      `Date of Birth: ${format(new Date(patient.dateOfBirth), 'MMM dd, yyyy')}`,
      `Gender: ${patient.gender}`,
      `Email: ${patient.email}`,
      `Phone: ${patient.phone}`,
      `Address: ${patient.address}, ${patient.city}, ${patient.state} ${patient.zipCode}`,
    ];

    if (patient.bloodType) patientInfo.push(`Blood Type: ${patient.bloodType}`);
    if (patient.allergies) patientInfo.push(`Allergies: ${patient.allergies}`);
    if (patient.insurance) patientInfo.push(`Insurance: ${patient.insurance} (ID: ${patient.insuranceId})`);
    if (patient.emergencyContact) {
      patientInfo.push(`Emergency Contact: ${patient.emergencyContact} (${patient.emergencyPhone})`);
    }

    patientInfo.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 5;
    });

    yPosition += 5;

    // Visit History
    if (visits.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Visit History', margin, yPosition);
      yPosition += 7;

      visits.forEach((visit, index) => {
        // Check if we need a new page
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(
          `Visit ${index + 1} - ${format(new Date(visit.visitDate), 'MMM dd, yyyy')}`,
          margin,
          yPosition
        );
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        const visitDetails = [
          `Chief Complaint: ${visit.chiefComplaint}`,
          visit.diagnosis && `Diagnosis: ${visit.diagnosis}`,
          visit.examinationFindings && `Examination: ${visit.examinationFindings}`,
          visit.treatmentPlan && `Treatment: ${visit.treatmentPlan}`,
          visit.prescriptions && `Prescriptions: ${visit.prescriptions}`,
          visit.followUp && `Follow-up: ${visit.followUp}`,
        ].filter(Boolean) as string[];

        visitDetails.forEach(line => {
          const splitLines = doc.splitTextToSize(line, pageWidth - 2 * margin);
          splitLines.forEach((splitLine: string) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(splitLine, margin, yPosition);
            yPosition += 4;
          });
        });

        yPosition += 5;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128);
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.text(
        `Generated on ${format(new Date(), 'MMM dd, yyyy HH:mm')} - Page ${i} of ${totalPages}`,
        margin,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Save the PDF
    doc.save(`${patient.lastName}_${patient.firstName}_medical_record.pdf`);
  },

  async exportPatientsToCSV(patients: Patient[]): Promise<void> {
    const csvData = patients.map(p => ({
      'First Name': p.firstName,
      'Last Name': p.lastName,
      'Date of Birth': p.dateOfBirth,
      'Gender': p.gender,
      'Email': p.email,
      'Phone': p.phone,
      'Address': p.address,
      'City': p.city,
      'State': p.state,
      'Zip Code': p.zipCode,
      'Blood Type': p.bloodType || '',
      'Allergies': p.allergies || '',
      'Insurance': p.insurance || '',
      'Insurance ID': p.insuranceId || '',
      'Emergency Contact': p.emergencyContact || '',
      'Emergency Phone': p.emergencyPhone || '',
      'Created At': p.createdAt,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `patients_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  },

  async exportVisitsToCSV(visits: Visit[]): Promise<void> {
    const csvData = visits.map(v => ({
      'Visit Date': v.visitDate,
      'Patient ID': v.patientId,
      'Chief Complaint': v.chiefComplaint,
      'Diagnosis': v.diagnosis || '',
      'Examination Findings': v.examinationFindings || '',
      'Treatment Plan': v.treatmentPlan || '',
      'Prescriptions': v.prescriptions || '',
      'Lab Orders': v.labOrders || '',
      'Follow-up': v.followUp || '',
      'Notes': v.notes || '',
      'Blood Pressure': v.vitalSigns?.bloodPressure || '',
      'Heart Rate': v.vitalSigns?.heartRate || '',
      'Temperature': v.vitalSigns?.temperature || '',
      'Created At': v.createdAt,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `visits_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  },

  async exportPatientVisitsToCSV(patientId: string, patient: Patient): Promise<void> {
    const visits = await visitService.getVisitsByPatientId(patientId);
    const csvData = visits.map(v => ({
      'Visit Date': format(new Date(v.visitDate), 'yyyy-MM-dd HH:mm'),
      'Chief Complaint': v.chiefComplaint,
      'Diagnosis': v.diagnosis || '',
      'Examination Findings': v.examinationFindings || '',
      'Treatment Plan': v.treatmentPlan || '',
      'Prescriptions': v.prescriptions || '',
      'Follow-up': v.followUp || '',
      'Notes': v.notes || '',
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${patient.lastName}_${patient.firstName}_visits_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  },
};
