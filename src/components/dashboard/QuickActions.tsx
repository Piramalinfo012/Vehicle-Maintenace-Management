import React from 'react';
import {
  Truck,
  Wrench,
  Search,
  BarChart3,
  Bell,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { label: 'Add Tanker', icon: Truck, id: 'add_tanker', color: 'bg-blue-50 text-[#1E3A8A] hover:bg-blue-100 border-blue-200' },
    { label: 'Create Maintenance', icon: Wrench, id: 'create_maintenance', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200' },
    { label: 'Report Breakdown', icon: AlertTriangle, id: 'report_breakdown', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' },
    { label: 'Search Tanker', icon: Search, id: 'search_tanker', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-200' },
    { label: 'View Reports', icon: BarChart3, id: 'reports', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
    { label: 'Notifications', icon: Bell, id: 'notifications', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
    { label: 'Google Apps Script', icon: Code2, id: 'apps_script', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
        Quick System Actions
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction(act.id)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 shadow-sm hover:shadow ${act.color}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-center leading-tight">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
