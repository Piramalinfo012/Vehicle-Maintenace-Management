import React from 'react';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { MaintenanceCharts } from '../components/dashboard/MaintenanceCharts';
import { UpcomingServices } from '../components/dashboard/UpcomingServices';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import {
  Tanker,
  MaintenanceRecord,
  ComplianceInsurance,
  ComplianceFitness,
  CompliancePermit,
  CompliancePuc,
  BreakdownRecord,
  ActivityLog,
} from '../types';

interface DashboardPageProps {
  tankers: Tanker[];
  maintenance: MaintenanceRecord[];
  insurances: ComplianceInsurance[];
  fitness: ComplianceFitness[];
  permits: CompliancePermit[];
  pucs: CompliancePuc[];
  breakdowns: BreakdownRecord[];
  activityLogs: ActivityLog[];
  onNavigate: (view: string) => void;
  onOpenAddTanker: () => void;
  onOpenCreateMaintenance: () => void;
  onOpenReportBreakdown: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  tankers = [],
  maintenance = [],
  insurances = [],
  fitness = [],
  permits = [],
  pucs = [],
  breakdowns = [],
  activityLogs = [],
  onNavigate,
  onOpenAddTanker = () => {},
  onOpenCreateMaintenance = () => {},
  onOpenReportBreakdown = () => {},
}) => {
  const handleQuickAction = (id: string) => {
    if (id === 'add_tanker') onOpenAddTanker();
    else if (id === 'create_maintenance') onOpenCreateMaintenance();
    else if (id === 'report_breakdown') onOpenReportBreakdown();
    else if (id === 'search_tanker') onNavigate('Tanker Master');
    else if (id === 'reports') onNavigate('Reports');
    else if (id === 'notifications') onNavigate('Reminders');
    else if (id === 'apps_script') onNavigate('Google Apps Script');
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fleet Executive Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time tanker maintenance, compliance, expenditure, and operational telematics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateMaintenance}
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all"
          >
            + Create Maintenance Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <KpiGrid
        tankers={tankers}
        maintenance={maintenance}
        insurances={insurances}
        fitness={fitness}
        permits={permits}
        pucs={pucs}
        breakdowns={breakdowns}
        onFilterClick={onNavigate}
      />

      {/* Quick Action Buttons */}
      <QuickActions onAction={handleQuickAction} />

      {/* Charts Section */}
      <MaintenanceCharts />

      {/* Bottom Grids: Upcoming Services & Activity Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingServices maintenance={maintenance} onViewAll={() => onNavigate('Maintenance')} />
        <RecentActivity logs={activityLogs} />
      </div>
    </div>
  );
};
