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
          bgIcon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
          accentBorder: 'border-l-4 border-l-emerald-600',
        };
      case 'danger':
        return {
          bgIcon: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
          accentBorder: 'border-l-4 border-l-rose-600',
        };
      case 'warning':
        return {
          bgIcon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
          accentBorder: 'border-l-4 border-l-amber-500',
        };
      case 'info':
        return {
          bgIcon: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
          accentBorder: 'border-l-4 border-l-sky-500',
        };
      case 'secondary':
        return {
          bgIcon: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
          accentBorder: 'border-l-4 border-l-blue-600',
        };
      default:
        return {
          bgIcon: 'bg-indigo-100 text-[#1E3A8A] dark:bg-indigo-950 dark:text-indigo-300',
          accentBorder: 'border-l-4 border-l-[#1E3A8A]',
        };
    }
  };

  const theme = getColorScheme();

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${theme.accentBorder} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl ${theme.bgIcon} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
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
