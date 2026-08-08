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
    { label: 'Add Vehicle / Car', icon: Truck, id: 'add_tanker', color: 'bg-blue-50/80 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60 border-blue-200/80 dark:border-blue-800/80' },
    { label: 'Create Service', icon: Wrench, id: 'create_maintenance', color: 'bg-indigo-50/80 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border-indigo-200/80 dark:border-indigo-800/80' },
    { label: 'Report Breakdown', icon: AlertTriangle, id: 'report_breakdown', color: 'bg-rose-50/80 text-rose-800 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-900/60 border-rose-200/80 dark:border-rose-800/80' },
    { label: 'Search Fleet', icon: Search, id: 'search_tanker', color: 'bg-sky-50/80 text-sky-800 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-900/60 border-sky-200/80 dark:border-sky-800/80' },
    { label: 'View Analytics', icon: BarChart3, id: 'reports', color: 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border-emerald-200/80 dark:border-emerald-800/80' },
    { label: 'Alerts & Reminders', icon: Bell, id: 'notifications', color: 'bg-amber-50/80 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/60 border-amber-200/80 dark:border-amber-800/80' },
    { label: 'Google Sheets API', icon: Code2, id: 'apps_script', color: 'bg-purple-50/80 text-purple-800 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900/60 border-purple-200/80 dark:border-purple-800/80' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3 font-sans">
        Quick System Operations
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction(act.id)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${act.color}`}
            >
              <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-center leading-tight text-[11px]">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
