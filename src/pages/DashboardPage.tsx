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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              Fleet Executive Dashboard
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
              Live Systems
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Real-time director fleet, tanker maintenance, compliance, expenditure, and operational status
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCreateMaintenance}
            className="px-4 py-2.5 text-xs font-bold text-white premium-gradient-btn rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <span>+</span> Create Maintenance Ticket
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
