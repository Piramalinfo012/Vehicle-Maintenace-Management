import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'primary',
  onClick,
}) => {
  const getColorScheme = () => {
    switch (color) {
      case 'success':
        return {
          bgIcon: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm shadow-emerald-500/10',
          topLine: 'bg-gradient-to-r from-emerald-500 to-teal-400',
        };
      case 'danger':
        return {
          bgIcon: 'bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60 shadow-sm shadow-rose-500/10',
          topLine: 'bg-gradient-to-r from-rose-500 to-red-500',
        };
      case 'warning':
        return {
          bgIcon: 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60 shadow-sm shadow-amber-500/10',
          topLine: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        };
      case 'info':
        return {
          bgIcon: 'bg-sky-50 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/60 shadow-sm shadow-sky-500/10',
          topLine: 'bg-gradient-to-r from-sky-500 to-blue-400',
        };
      case 'secondary':
        return {
          bgIcon: 'bg-purple-50 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shadow-sm shadow-purple-500/10',
          topLine: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        };
      default:
        return {
          bgIcon: 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-sm shadow-blue-500/10',
          topLine: 'bg-gradient-to-r from-blue-600 to-indigo-600',
        };
    }
  };

  const theme = getColorScheme();

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Subtle Gradient Line Top Accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${theme.topLine}`} />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 font-sans">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1 font-display">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${theme.bgIcon} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {subtitle && <span className="line-clamp-1">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold shrink-0 ${
                trend.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
