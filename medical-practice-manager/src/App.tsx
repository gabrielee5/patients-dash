import { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PatientList } from './components/PatientList';
import { PatientDetail } from './components/PatientDetail';
import { Templates } from './components/Templates';
import { Modal } from './components/ui';
import { PatientForm } from './components/PatientForm';
import { VisitForm } from './components/VisitForm';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useTheme } from './contexts/ThemeContext';
import { sampleDataService } from './services/sampleDataService';
import type { Patient, Visit } from './types';

type Page = 'dashboard' | 'patients' | 'templates' | 'patient-detail';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [newPatientModalOpen, setNewPatientModalOpen] = useState(false);
  const [newVisitModalOpen, setNewVisitModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toggleTheme } = useTheme();

  useEffect(() => {
    // Initialize sample data on first load
    sampleDataService.initializeSampleData();
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    newPatient: () => setNewPatientModalOpen(true),
    newVisit: () => setNewVisitModalOpen(true),
    search: () => {
      setCurrentPage('patients');
      // Focus on search input after a short delay
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }, 100);
    },
    dashboard: () => setCurrentPage('dashboard'),
    patients: () => setCurrentPage('patients'),
    toggleTheme: toggleTheme,
  });

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentPage('patient-detail');
  };

  const handleBackToList = () => {
    setSelectedPatientId(null);
    setCurrentPage('patients');
  };

  const handlePatientSaved = (patient: Patient) => {
    setNewPatientModalOpen(false);
    setRefreshKey((prev) => prev + 1);
    handlePatientClick(patient.id);
  };

  const handleVisitSaved = (visit: Visit) => {
    setNewVisitModalOpen(false);
    setRefreshKey((prev) => prev + 1);
    if (visit.patientId) {
      handlePatientClick(visit.patientId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            key={`dashboard-${refreshKey}`}
            onPatientClick={handlePatientClick}
            onNewVisit={() => setNewVisitModalOpen(true)}
          />
        );
      case 'patients':
        return (
          <PatientList
            key={`patients-${refreshKey}`}
            onPatientClick={handlePatientClick}
          />
        );
      case 'templates':
        return <Templates />;
      case 'patient-detail':
        return selectedPatientId ? (
          <PatientDetail
            key={`patient-${selectedPatientId}-${refreshKey}`}
            patientId={selectedPatientId}
            onBack={handleBackToList}
            onPatientUpdated={() => setRefreshKey((prev) => prev + 1)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page as Page)}
        onNewPatient={() => setNewPatientModalOpen(true)}
        onNewVisit={() => setNewVisitModalOpen(true)}
      >
        {renderPage()}
      </Layout>

      {/* New Patient Modal */}
      <Modal
        isOpen={newPatientModalOpen}
        onClose={() => setNewPatientModalOpen(false)}
        title="New Patient"
        size="lg"
      >
        <PatientForm
          onSave={handlePatientSaved}
          onCancel={() => setNewPatientModalOpen(false)}
        />
      </Modal>

      {/* New Visit Modal */}
      <Modal
        isOpen={newVisitModalOpen}
        onClose={() => setNewVisitModalOpen(false)}
        title="New Visit"
        size="xl"
      >
        <VisitForm
          onSave={handleVisitSaved}
          onCancel={() => setNewVisitModalOpen(false)}
        />
      </Modal>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
