import React from 'react';
import { Reminder, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Bell, Calendar, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface RemindersPageProps {
  reminders: Reminder[];
  tankers: Tanker[];
}

export const RemindersPage: React.FC<RemindersPageProps> = ({ reminders = [], tankers = [] }) => {
  const { showToast } = useNotification();

  const columns: Column<Reminder>[] = [
    {
      header: 'Reminder Code',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</span>,
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Alert Category',
      accessor: (row) => (
        <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Due Date',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.dueDate}</span>,
      sortable: true,
      sortKey: 'dueDate',
    },
    {
      header: 'Days Left',
      accessor: (row) => (
        <span
          className={`font-extrabold font-mono ${
            row.daysRemaining <= 5
              ? 'text-rose-600 dark:text-rose-400 animate-pulse'
              : row.daysRemaining <= 15
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {row.daysRemaining <= 0 ? 'EXPIRED' : `${row.daysRemaining} Days`}
        </span>
      ),
      sortable: true,
      sortKey: 'daysRemaining',
    },
    {
      header: 'Severity / Urgency',
      accessor: (row) => <Badge status={row.severity} size="sm" />,
      sortable: true,
      sortKey: 'severity',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <button
          onClick={() =>
            showToast('Reminder Dismissed', `Action item ${row.id} marked complete for ${row.tankerNumber}`, 'success')
          }
          className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1"
        >
          <CheckCircle2 className="w-3 h-3" /> Mark Resolved
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Automated Reminders & Compliance Expiry Alerts
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Proactive notifications for upcoming insurance renewals, fitness tests, oil change intervals, and tyre rotation schedules
        </p>
      </div>

      <Table
        title="Active System Compliance Alerts"
        columns={columns}
        data={reminders}
        searchPlaceholder="Search Tanker, Category, Severity..."
      />
    </div>
  );
};
