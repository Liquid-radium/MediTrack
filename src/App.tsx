import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { PatientProvider, usePatients } from './contexts/PatientContext';
import { UserProvider } from './contexts/UserContext';
import { DashboardView } from './components/views/DashboardView';
import { AddPatientView } from './components/views/AddPatientView';
import { EditPatientView } from './components/views/EditPatientView';
import { ViewAllPatientsView } from './components/views/ViewAllPatientsView';
import { GenerateQRView } from './components/views/GenerateQRView';
import { ScanQRView } from './components/views/ScanQRView';
import { ProfileDialog } from './components/ProfileDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const { patients } = usePatients();

  const renderView = () => {
    switch (activeTab) {
      case 'Add Patients':
        return <AddPatientView />;
      case 'Edit Patients':
        return <EditPatientView />;
      case 'View All Patients':
        return <ViewAllPatientsView />;
      case 'Generate QR':
        return <GenerateQRView />;
      case 'Scan QR':
        return <ScanQRView />;
      case 'High Alert Patients':
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header Navigation */}
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          patientCount={patients.length}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-background">
          {renderView()}
        </main>
      </div>
      
      {/* Profile Dialog */}
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      
      {/* Settings Dialog */}
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <PatientProvider>
        <AppContent />
      </PatientProvider>
    </UserProvider>
  );
}