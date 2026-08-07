import React from 'react';
import { MaintenanceRecord } from '../../types';
import { Badge } from '../common/Badge';
import { Calendar, Wrench, ArrowRight } from 'lucide-react';

interface UpcomingServicesProps {
  maintenance: MaintenanceRecord[];
  onViewAll: () => void;
}

export const UpcomingServices: React.FC<UpcomingServicesProps> = ({ maintenance = [], onViewAll }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Scheduled Maintenance & Services
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pending & ongoing workshop service jobs</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#1E3A8A] dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {maintenance.length > 0 ? (
          maintenance.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:bg-slate-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-[#1E3A8A] dark:text-indigo-300 flex items-center justify-center shrink-0 font-bold">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{rec.tankerNumber}</span>
                    <Badge status={rec.type} size="sm" />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">{rec.complaint}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <Badge status={rec.status} size="sm" />
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 justify-end font-mono">
                  <Calendar className="w-3 h-3" /> {rec.date}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">No pending maintenance jobs.</p>
        )}
      </div>
    </div>
  );
};
