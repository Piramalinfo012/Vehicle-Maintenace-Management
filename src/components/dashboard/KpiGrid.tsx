import React from 'react';
import { StatCard } from '../common/StatCard';
import { Tanker, MaintenanceRecord, ComplianceInsurance, ComplianceFitness, CompliancePermit, CompliancePuc, BreakdownRecord } from '../../types';
import {
  Car,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  CalendarCheck,
  DollarSign,
} from 'lucide-react';

interface KpiGridProps {
  tankers: Tanker[];
  maintenance: MaintenanceRecord[];
  insurances: ComplianceInsurance[];
  fitness: ComplianceFitness[];
  permits: CompliancePermit[];
  pucs: CompliancePuc[];
  breakdowns: BreakdownRecord[];
  onFilterClick: (view: string) => void;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  tankers = [],
  maintenance = [],
  insurances = [],
  fitness = [],
  permits = [],
  pucs = [],
  breakdowns = [],
  onFilterClick,
}) => {
  const totalTankers = tankers.length;
  const availableTankers = tankers.filter((t) => t.status === 'Available').length;
  const underMaintenance = tankers.filter((t) => t.status === 'Under Maintenance').length;
  const breakdownCount = tankers.filter((t) => t.status === 'Breakdown').length;

  const dueTodayCount = maintenance.filter((m) => m.status === 'Pending' || m.status === 'Running').length;

  const totalMntCost = maintenance.reduce((sum, m) => sum + (m.totalCost || 0), 0);
  const avgMntCost = maintenance.length > 0 ? Math.round(totalMntCost / maintenance.length) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      <StatCard
        title="Total Fleet Vehicles"
        value={totalTankers}
        subtitle="Director Cars & Tankers"
        icon={Car}
        color="primary"
        onClick={() => onFilterClick('Tanker Master')}
      />

      <StatCard
        title="Available Vehicles"
        value={availableTankers}
        subtitle="Ready for Trip / Duty"
        icon={CheckCircle2}
        color="success"
        onClick={() => onFilterClick('Tanker Master')}
      />

      <StatCard
        title="Under Maintenance"
        value={underMaintenance}
        subtitle="In Workshop Servicing"
        icon={Wrench}
        color="warning"
        onClick={() => onFilterClick('Maintenance')}
      />

      <StatCard
        title="Active Breakdown"
        value={breakdownCount}
        subtitle="Requires Immediate Action"
        icon={AlertTriangle}
        color="danger"
        onClick={() => onFilterClick('Breakdown')}
      />

      <StatCard
        title="Maintenance Due Today"
        value={dueTodayCount}
        subtitle="Pending & Scheduled Jobs"
        icon={CalendarCheck}
        color="info"
        onClick={() => onFilterClick('Maintenance')}
      />

      <StatCard
        title="Avg Maintenance Cost"
        value={`₹${avgMntCost.toLocaleString('en-IN')}`}
        subtitle="Per Service Ticket"
        icon={DollarSign}
        color="secondary"
        onClick={() => onFilterClick('Expense')}
      />
    </div>
  );
};
