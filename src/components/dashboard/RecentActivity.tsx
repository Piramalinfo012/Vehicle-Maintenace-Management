import React from 'react';
import { ActivityLog } from '../../types';
import { Clock, User, FileText } from 'lucide-react';

interface RecentActivityProps {
  logs: ActivityLog[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ logs = [] }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Audit Trail & System Logs
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time enterprise user activity timeline</p>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          Live Stream
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {logs.slice(0, 5).map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{log.details}</span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{log.timestamp.split(' ')[1]}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" /> {log.user}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 font-mono text-[10px] text-slate-700 dark:text-slate-300">
                  {log.module}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
