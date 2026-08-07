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
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (val.includes('maintenance') || val.includes('running') || val.includes('in progress') || val.includes('needs rotation') || val.includes('medium') || val.includes('low charge')) {
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    }
    if (val.includes('breakdown') || val.includes('expired') || val.includes('high') || val.includes('worn out') || val.includes('emergency') || val.includes('inactive')) {
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    }
    if (val.includes('expiring soon') || val.includes('pending') || val.includes('reported')) {
      return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800';
    }
    if (val.includes('in transit')) {
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  const sizeClass =
    size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : size === 'lg' ? 'px-3.5 py-1.5 text-sm font-semibold' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${getStyle()} ${sizeClass} transition-colors whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 animate-pulse" />
      {status}
    </span>
  );
};
