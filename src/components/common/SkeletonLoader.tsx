import React from 'react';

export const SkeletonLoader: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse p-4">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full flex items-center gap-4 px-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/5" />
        </div>
      ))}
    </div>
  );
};
