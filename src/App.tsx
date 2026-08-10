import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

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

import { fetchAllSheets, createRecord, updateRecord, deleteRecord } from './services/googleSheetsApi';
import {
  Tanker,
  MaintenanceRecord,
  TyreRecord,
  BatteryRecord,
  ComplianceInsurance,
  ComplianceFitness,
  CompliancePermit,
  CompliancePuc,
  ExpenseRecord,
  FuelLog,
  BreakdownRecord,
  SystemDocument,
  User,
  Reminder,
  NotificationItem,
  ActivityLog,
} from './types';

const MainLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('Dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // Master State Arrays - populated live from Google Sheets on load
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [tyres, setTyres] = useState<TyreRecord[]>([]);
  const [batteries, setBatteries] = useState<BatteryRecord[]>([]);
  const [insurances, setInsurances] = useState<ComplianceInsurance[]>([]);
  const [fitness, setFitness] = useState<ComplianceFitness[]>([]);
  const [permits, setPermits] = useState<CompliancePermit[]>([]);
  const [pucs, setPucs] = useState<CompliancePuc[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [documents, setDocuments] = useState<SystemDocument[]>([]);
  const [breakdowns, setBreakdowns] = useState<BreakdownRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    setIsLoadingData(true);
    setLoadErrors([]);

    fetchAllSheets().then((results) => {
      if (cancelled) return;

      // Only Users, Vehicle Master (Tankers), Maintenance, Expenses and
      // Breakdown have tabs in the connected sheet today. Fuel/Tyres/Battery/
      // Insurance/Fitness/Permit/PUC/Documents have no backing tab yet, so
      // those modules stay local-only until matching tabs are added.
      setTankers(results.tankers.data);
      setMaintenance(results.maintenance.data);
      setExpenses(results.expenses.data);
      setBreakdowns(results.breakdown.data);
      setUsers(results.users.data);

      const errors = Object.values(results)
        .filter((r) => r.error)
        .map((r) => `${r.key}: ${r.error}`);
      setLoadErrors(errors);
      setIsLoadingData(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, reloadToken]);

  const logActivity = (action: string, module: string, details: string) => {
    const entry: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toLocaleString('en-IN'),
      user: user?.name || 'System User',
      action,
      module,
      details,
    };
    setActivityLogs((prev) => [entry, ...prev].slice(0, 50));
  };

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
    createRecord('tankers', created).catch((err) => console.error('Failed to sync Tanker create:', err));
    logActivity('CREATE', 'Tankers', `Added Tanker ${created.tankerNumber}`);
  };

  const handleEditTanker = (updated: Tanker) => {
    setTankers(tankers.map((t) => (t.id === updated.id ? updated : t)));
    updateRecord('tankers', updated.id, updated).catch((err) => console.error('Failed to sync Tanker update:', err));
    logActivity('UPDATE', 'Tankers', `Updated Tanker ${updated.tankerNumber}`);
  };

  const handleDeleteTanker = (id: string) => {
    setTankers(tankers.filter((t) => t.id !== id));
    deleteRecord('tankers', id).catch((err) => console.error('Failed to sync Tanker delete:', err));
    logActivity('DELETE', 'Tankers', `Deleted Tanker ${id}`);
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
    createRecord('maintenance', created).catch((err) => console.error('Failed to sync Maintenance create:', err));
    logActivity('CREATE', 'Maintenance', `Created Maintenance ${created.id} for ${created.tankerNumber}`);
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
          updateRecord('tankers', updated.id, updated).catch((err) => console.error('Failed to sync Tanker update:', err));
          return updated;
        }
        return t;
      })
    );
  };

  const handleEditMaintenance = (updated: MaintenanceRecord) => {
    setMaintenance(maintenance.map((m) => (m.id === updated.id ? updated : m)));
    updateRecord('maintenance', updated.id, updated).catch((err) => console.error('Failed to sync Maintenance update:', err));
    logActivity('UPDATE', 'Maintenance', `Updated Maintenance ${updated.id}`);
  };

  const handleDeleteMaintenance = (id: string) => {
    setMaintenance(maintenance.filter((m) => m.id !== id));
    deleteRecord('maintenance', id).catch((err) => console.error('Failed to sync Maintenance delete:', err));
    logActivity('DELETE', 'Maintenance', `Deleted Maintenance ${id}`);
  };

  // Handlers for Tyres, Battery, Fuel - no sheet tab exists for these yet,
  // so they stay local-only (session state) until matching tabs are added.
  const handleAddTyre = (tyre: TyreRecord) => {
    setTyres([tyre, ...tyres]);
    logActivity('CREATE', 'Tyres', `Registered Tyre ${tyre.tyreNumber} on ${tyre.tankerNumber} (local only - no Tyres sheet tab)`);
  };

  const handleAddBattery = (battery: BatteryRecord) => {
    setBatteries([battery, ...batteries]);
    logActivity('CREATE', 'Battery', `Registered Battery ${battery.batteryNumber} on ${battery.tankerNumber} (local only - no Battery sheet tab)`);
  };

  const handleAddFuel = (log: FuelLog) => {
    setFuelLogs([log, ...fuelLogs]);
    logActivity('CREATE', 'Fuel', `Logged ${log.litres}L fuel entry for ${log.tankerNumber} (local only - no Fuel sheet tab)`);
  };

  const handleAddUser = (newUser: User, password: string) => {
    setUsers([...users, newUser]);
    createRecord('users', { name: newUser.name, id: newUser.id, Password: password, role: newUser.role, lastLogin: '' }).catch((err) =>
      console.error('Failed to sync User create:', err)
    );
    logActivity('CREATE', 'Users', `Provisioned user account for ${newUser.name}`);
  };

  // Reminders Generation (derived live from compliance data)
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

  // Notifications Generation (derived live from compliance data, replaces mock feed)
  const notifications: NotificationItem[] = [
    ...insurances
      .filter((i) => i.status === 'Expiring Soon' || i.status === 'Expired')
      .map((i) => ({
        id: `NTF-INS-${i.id}`,
        type: 'Insurance' as const,
        title: i.status === 'Expired' ? 'Insurance Expired' : 'Insurance Expiring Soon',
        message: `Policy ${i.policyNumber} for ${i.tankerNumber} ${i.status === 'Expired' ? 'has expired' : 'is expiring soon'} (${i.expiryDate}).`,
        date: i.expiryDate,
        tankerNumber: i.tankerNumber,
        read: false,
        urgency: i.status === 'Expired' ? 'high' : ('medium' as 'high' | 'medium' | 'low'),
      })),
    ...fitness
      .filter((f) => f.status === 'Expiring Soon' || f.status === 'Expired')
      .map((f) => ({
        id: `NTF-FIT-${f.id}`,
        type: 'Fitness' as const,
        title: f.status === 'Expired' ? 'Fitness Certificate Expired' : 'Fitness Certificate Expiring Soon',
        message: `Certificate ${f.certificateNumber} for ${f.tankerNumber} ${f.status === 'Expired' ? 'has expired' : 'is expiring soon'} (${f.expiryDate}).`,
        date: f.expiryDate,
        tankerNumber: f.tankerNumber,
        read: false,
        urgency: f.status === 'Expired' ? 'high' : ('medium' as 'high' | 'medium' | 'low'),
      })),
    ...breakdowns
      .filter((b) => b.status !== 'Resolved')
      .map((b) => ({
        id: `NTF-BKD-${b.id}`,
        type: 'Breakdown' as const,
        title: 'Active Breakdown',
        message: `${b.tankerNumber} reported a breakdown at ${b.location}: ${b.complaint}`,
        date: b.date,
        tankerNumber: b.tankerNumber,
        read: false,
        urgency: 'high' as const,
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
          notifications={notifications}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
          {loadErrors.length > 0 && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Some data couldn't be loaded from Google Sheets
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 break-words">
                  {loadErrors.join(' • ')}
                </p>
              </div>
              <button
                onClick={() => setReloadToken((t) => t + 1)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/60 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {isLoadingData ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A] dark:text-blue-400" />
              <p className="text-xs font-semibold">Loading live data from Google Sheets...</p>
            </div>
          ) : (
            <>
              {currentView === 'Dashboard' && (
                <DashboardPage
                  tankers={tankers}
                  maintenance={maintenance}
                  insurances={insurances}
                  fitness={fitness}
                  permits={permits}
                  pucs={pucs}
                  breakdowns={breakdowns}
                  activityLogs={activityLogs}
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
                  onUpdateTanker={(id, data) => {
                    const existing = tankers.find((t) => t.id === id);
                    if (existing) handleEditTanker({ ...existing, ...data });
                  }}
                  onDeleteTanker={handleDeleteTanker}
                  onViewServiceHistory={(tankerNumber) => setCurrentView('Service History')}
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
                <FuelPage fuelLogs={fuelLogs} tankers={tankers} onAddFuel={handleAddFuel} />
              )}

              {currentView === 'Tyres' && (
                <TyresPage tyres={tyres} tankers={tankers} onAddTyre={handleAddTyre} />
              )}

              {currentView === 'Battery' && (
                <BatteryPage batteries={batteries} tankers={tankers} onAddBattery={handleAddBattery} />
              )}

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
                  documents={documents}
                  setDocuments={setDocuments}
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
                    const record = rec as BreakdownRecord;
                    setBreakdowns([record, ...breakdowns]);
                    // The Breakdown sheet has no columns for driverPhone/description/
                    // actionTaken/towingRequired - fold them into remarks so they aren't lost.
                    const remarks = [
                      record.remarks,
                      record.description,
                      record.actionTaken,
                      record.driverPhone ? `Driver Phone: ${record.driverPhone}` : '',
                      record.towingRequired ? 'Towing Required' : '',
                    ].filter(Boolean).join(' | ');
                    createRecord('breakdown', { ...record, remarks }).catch((err) =>
                      console.error('Failed to sync Breakdown create:', err)
                    );
                    logActivity('CREATE', 'Breakdown', `Reported Breakdown for ${record.tankerNumber}`);
                  }}
                />
              )}

              {currentView === 'Reminders' && <RemindersPage reminders={reminders} tankers={tankers} />}

              {currentView === 'Reports' && (
                <ReportsPage tankers={tankers} maintenance={maintenance} fuelLogs={fuelLogs} />
              )}

              {currentView === 'Users' && <UsersPage users={users} onAddUser={handleAddUser} />}

              {currentView === 'Settings' && <SettingsPage />}

              {currentView === 'Google Apps Script' && <GoogleAppsScriptPage />}
            </>
          )}
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
