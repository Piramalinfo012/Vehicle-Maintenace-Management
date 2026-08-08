import React from 'react';

interface BadgeProps {
  status: string;
  type?: 'status' | 'urgency' | 'role';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'status', size = 'sm' }) => {
  const getStyle = () => {
    const val = (status || '').toLowerCase();

    if (val.includes('available') || val.includes('active') || val.includes('healthy') || val.includes('good') || val.includes('completed') || val.includes('resolved')) {
      return 'bg-emerald-50/90 text-emerald-800 border-emerald-300/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80 shadow-xs shadow-emerald-500/10 font-bold';
    }
    if (val.includes('maintenance') || val.includes('running') || val.includes('in progress') || val.includes('needs rotation') || val.includes('medium') || val.includes('low charge')) {
      return 'bg-amber-50/90 text-amber-800 border-amber-300/80 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80 shadow-xs shadow-amber-500/10 font-bold';
    }
    if (val.includes('breakdown') || val.includes('expired') || val.includes('high') || val.includes('worn out') || val.includes('emergency') || val.includes('inactive')) {
      return 'bg-rose-50/90 text-rose-800 border-rose-300/80 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80 shadow-xs shadow-rose-500/10 font-bold';
    }
    if (val.includes('expiring soon') || val.includes('pending') || val.includes('reported')) {
      return 'bg-orange-50/90 text-orange-800 border-orange-300/80 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800/80 shadow-xs shadow-orange-500/10 font-bold';
    }
    if (val.includes('in transit')) {
      return 'bg-blue-50/90 text-blue-800 border-blue-300/80 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800/80 shadow-xs shadow-blue-500/10 font-bold';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 font-semibold';
  };

  const sizeClass =
    size === 'sm' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3.5 py-1.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${getStyle()} ${sizeClass} transition-colors whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse shrink-0" />
      {status}
    </span>
  );
};
