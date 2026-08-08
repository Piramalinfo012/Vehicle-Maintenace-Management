import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TankerMasterPage } from './pages/TankerMasterPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { FuelPage } from './pages/FuelPage';
import { TyresPage } from './pages/TyresPage';
import { BatteryPage } from './pages/BatteryPage';
import { InsurancePage } from './pages/InsurancePage';
import { FitnessPage } from './pages/FitnessPage';
import { PermitPage } from './pages/PermitPage';
import { PucPage } from './pages/PucPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ServiceHistoryPage } from './pages/ServiceHistoryPage';
import { ExpensePage } from './pages/ExpensePage';
import { BreakdownPage } from './pages/BreakdownPage';
import { RemindersPage } from './pages/RemindersPage';
import { ReportsPage } from './pages/ReportsPage';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { GoogleAppsScriptPage } from './pages/GoogleAppsScriptPage';

// Initial Data
import {
  initialTankers,
  initialMaintenanceRecords,
  initialTyres,
  initialBatteries,
  initialInsurances,
  initialFitness,
  initialPermits,
  initialPucs,
  initialFuelLogs,
  initialBreakdowns,
  initialDocuments,
  initialNotifications,
  initialActivityLogs,
} from './data/initialData';

import { syncToGoogleSheet } from './services/googleSheetsSync';
import {
  Tanker,
  MaintenanceRecord,
  TyreRecord,
  BatteryRecord,
  ComplianceInsurance,
  ComplianceFitness,
  CompliancePermit,
  CompliancePuc,
  FuelLog,
  BreakdownRecord,
  SystemDocument,
  Reminder,
} from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<string>('Dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Master State Arrays
  const [tankers, setTankers] = useState<Tanker[]>(initialTankers);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs || []);
  const [tyres, setTyres] = useState<TyreRecord[]>(initialTyres);
  const [batteries, setBatteries] = useState<BatteryRecord[]>(initialBatteries);
  const [insurances, setInsurances] = useState<ComplianceInsurance[]>(initialInsurances);
  const [fitness, setFitness] = useState<ComplianceFitness[]>(initialFitness);
  const [permits, setPermits] = useState<CompliancePermit[]>(initialPermits);
  const [pucs, setPucs] = useState<CompliancePuc[]>(initialPucs);
  const [documents, setDocuments] = useState<SystemDocument[]>(initialDocuments);
  const [breakdowns, setBreakdowns] = useState<BreakdownRecord[]>(initialBreakdowns);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handlers for Tankers
  const handleAddTanker = (newTanker: Partial<Tanker>) => {
    const created: Tanker = {
      id: `TNK-${(tankers.length + 1).toString().padStart(3, '0')}`,
      tankerNumber: newTanker.tankerNumber || 'MH-04-NEW-000',
      registrationNumber: newTanker.registrationNumber || 'MH04NEW000',
      vehicleType: newTanker.vehicleType || 'Petroleum Tanker',
      capacity: newTanker.capacity || '24,000 Litres',
      manufacturer: newTanker.manufacturer || 'BharatBenz',
      model: newTanker.model || 'Heavy Hauler',
      engineNumber: newTanker.engineNumber || 'ENG-NEW-001',
      chassisNumber: newTanker.chassisNumber || 'CHS-NEW-001',
      purchaseDate: newTanker.purchaseDate || new Date().toISOString().slice(0, 10),
      purchaseCost: Number(newTanker.purchaseCost) || 4000000,
      owner: newTanker.owner || 'Piramal Petroleum Fleet Ops',
      driver: newTanker.driver || 'Assigned Driver',
      transporter: newTanker.transporter || 'Piramal Logistics Ltd',
      currentKm: Number(newTanker.currentKm) || 100000,
      status: 'Available',
      location: newTanker.location || 'Depot Terminal 1',
      photoUrl: newTanker.photoUrl || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
      remarks: newTanker.remarks || 'Registered in Tanker Master',
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setTankers([created, ...tankers]);
    syncToGoogleSheet('create', 'Tankers', created);
  };

  const handleEditTanker = (updated: Tanker) => {
    setTankers(tankers.map((t) => (t.id === updated.id ? updated : t)));
    syncToGoogleSheet('update', 'Tankers', updated);
  };

  const handleDeleteTanker = (id: string) => {
    setTankers(tankers.filter((t) => t.id !== id));
    syncToGoogleSheet('delete', 'Tankers', { id });
  };

  // Handlers for Maintenance
  const handleAddMaintenance = (newRecord: Partial<MaintenanceRecord>) => {
    const created: MaintenanceRecord = {
      id: `MNT-2026-${(maintenance.length + 90).toString().padStart(3, '0')}`,
      date: newRecord.date || new Date().toISOString().slice(0, 10),
      tankerId: newRecord.tankerId || tankers[0]?.id || 'TNK-001',
      tankerNumber: newRecord.tankerNumber || tankers[0]?.tankerNumber || 'MH-04-FK-1201',
      currentKm: Number(newRecord.currentKm) || 140000,
      type: newRecord.type || 'Preventive',
      vendor: newRecord.vendor || 'Authorized Workshop',
      workshop: newRecord.workshop || 'Main Workshop',
      complaint: newRecord.complaint || 'Routine Service',
      workDescription: newRecord.workDescription || 'Maintenance executed',
      spareParts: newRecord.spareParts || [],
      labourCost: Number(newRecord.labourCost) || 0,
      materialCost: Number(newRecord.materialCost) || 0,
      otherCost: Number(newRecord.otherCost) || 0,
      totalCost: newRecord.totalCost ? Number(newRecord.totalCost) : ((Number(newRecord.labourCost) || 0) + (Number(newRecord.materialCost) || 0) + (Number(newRecord.otherCost) || 0)),
      expectedCompletion: newRecord.expectedCompletion || new Date().toISOString().slice(0, 10),
      status: newRecord.status || 'Completed',
      remarks: newRecord.remarks || '',
      nextServiceDueDate: newRecord.nextServiceDueDate || '',
      nextServiceDueKm: newRecord.nextServiceDueKm ? Number(newRecord.nextServiceDueKm) : undefined,
    };
    setMaintenance([created, ...maintenance]);
    syncToGoogleSheet('create', 'Maintenance', created);
  };

  const handleUpdateVehicleService = (updatedVeh: {
    tankerNumber: string;
    lastServiceDate: string;
    lastServiceKm: number;
    nextServiceDueDate: string;
    nextServiceDueKm: number;
    currentKm: number;
  }) => {
    setTankers((prev) =>
      prev.map((t) => {
        if (t.tankerNumber === updatedVeh.tankerNumber) {
          const updated = {
            ...t,
            lastServiceDate: updatedVeh.lastServiceDate,
            lastServiceKm: updatedVeh.lastServiceKm,
            nextServiceDueDate: updatedVeh.nextServiceDueDate,
            nextServiceDueKm: updatedVeh.nextServiceDueKm,
            currentKm: Math.max(t.currentKm, updatedVeh.currentKm),
          };
          syncToGoogleSheet('update', 'Tankers', updated);
          return updated;
        }
        return t;
      })
    );
  };

  const handleEditMaintenance = (updated: MaintenanceRecord) => {
    setMaintenance(maintenance.map((m) => (m.id === updated.id ? updated : m)));
    syncToGoogleSheet('update', 'Maintenance', updated);
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenance(maintenance.filter((m) => m.id !== id));
    syncToGoogleSheet('delete', 'Maintenance', { id });
  };

  // Reminders Generation
  const reminders: Reminder[] = [
    ...insurances
      .filter((i) => i.status === 'Expiring Soon' || i.status === 'Expired')
      .map((i) => ({
        id: `REM-INS-${i.id}`,
        tankerNumber: i.tankerNumber,
        category: 'Insurance Renewal',
        dueDate: i.expiryDate,
        daysRemaining: 12,
        severity: i.status === 'Expired' ? ('High' as const) : ('Medium' as const),
      })),
    ...fitness
      .filter((f) => f.status === 'Expiring Soon' || f.status === 'Expired')
      .map((f) => ({
        id: `REM-FIT-${f.id}`,
        tankerNumber: f.tankerNumber,
        category: 'Fitness Test',
        dueDate: f.expiryDate,
        daysRemaining: 2,
        severity: 'High' as const,
      })),
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        breakdownCount={breakdowns.filter((b) => b.status !== 'Resolved').length}
        maintenanceCount={maintenance.filter((m) => m.status === 'Running').length}
        reminderCount={reminders.length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          onNavigate={setCurrentView}
          onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          {currentView === 'Dashboard' && (
            <DashboardPage
              tankers={tankers}
              maintenance={maintenance}
              insurances={insurances}
              fitness={fitness}
              permits={permits}
              pucs={pucs}
              breakdowns={breakdowns}
              activityLogs={initialActivityLogs}
              onNavigate={setCurrentView}
              onOpenAddTanker={() => setCurrentView('Tanker Master')}
              onOpenCreateMaintenance={() => setCurrentView('Maintenance')}
              onOpenReportBreakdown={() => setCurrentView('Breakdown')}
            />
          )}

          {currentView === 'Tanker Master' && (
            <TankerMasterPage
              tankers={tankers}
              onAddTanker={handleAddTanker}
              onEditTanker={handleEditTanker}
              onDeleteTanker={handleDeleteTanker}
            />
          )}

          {currentView === 'Maintenance' && (
            <MaintenancePage
              maintenance={maintenance}
              tankers={tankers}
              onAddMaintenance={handleAddMaintenance}
              onEditMaintenance={handleEditMaintenance}
              onDeleteMaintenance={handleDeleteMaintenance}
            />
          )}

          {currentView === 'Fuel' && (
            <FuelPage fuelLogs={fuelLogs} tankers={tankers} setFuelLogs={setFuelLogs} />
          )}

          {currentView === 'Tyres' && <TyresPage tyres={tyres} tankers={tankers} />}

          {currentView === 'Battery' && <BatteryPage batteries={batteries} tankers={tankers} />}

          {currentView === 'Insurance' && <InsurancePage insurances={insurances} tankers={tankers} />}

          {currentView === 'Fitness' && <FitnessPage fitness={fitness} tankers={tankers} />}

          {currentView === 'Permit' && <PermitPage permits={permits} tankers={tankers} />}

          {currentView === 'PUC' && <PucPage pucs={pucs} tankers={tankers} />}

          {currentView === 'Documents' && (
            <DocumentsPage
              tankers={tankers}
              insurances={insurances}
              fitness={fitness}
              permits={permits}
              pucs={pucs}
            />
          )}

          {currentView === 'Service History' && (
            <ServiceHistoryPage
              maintenance={maintenance}
              tankers={tankers}
              onAddMaintenance={handleAddMaintenance}
              onUpdateVehicleService={handleUpdateVehicleService}
            />
          )}

          {currentView === 'Expense' && <ExpensePage maintenance={maintenance} tankers={tankers} />}

          {currentView === 'Breakdown' && (
            <BreakdownPage
              breakdowns={breakdowns}
              tankers={tankers}
              onReportBreakdown={(rec) => {
                setBreakdowns([rec as BreakdownRecord, ...breakdowns]);
                syncToGoogleSheet('create', 'Breakdown', rec);
              }}
            />
          )}

          {currentView === 'Reminders' && <RemindersPage reminders={reminders} tankers={tankers} />}

          {currentView === 'Reports' && (
            <ReportsPage tankers={tankers} maintenance={maintenance} fuelLogs={fuelLogs} />
          )}

          {currentView === 'Users' && <UsersPage />}

          {currentView === 'Settings' && <SettingsPage />}

          {currentView === 'Google Apps Script' && <GoogleAppsScriptPage />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainLayout />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
