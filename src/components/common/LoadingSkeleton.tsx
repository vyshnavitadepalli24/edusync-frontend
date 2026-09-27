import React from 'react';

export const LoadingSkeleton: React.FC<{
  rows?: number;
  type?: 'table' | 'cards' | 'chart';
}> = ({ rows = 4, type = 'table' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-7 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-56 bg-slate-100 rounded-lg flex items-end justify-between p-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-200 rounded-t w-full"
              style={{ height: `${30 + (i * 12) % 65}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-pulse">
      <div className="p-4 bg-slate-50 flex gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/5" />
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
        <div className="h-4 bg-slate-200 rounded w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 items-center">
          <div className="h-4 bg-slate-200 rounded w-1/5" />
          <div className="h-4 bg-slate-100 rounded w-1/4" />
          <div className="h-4 bg-slate-100 rounded w-1/6" />
          <div className="h-4 bg-slate-100 rounded w-1/6" />
        </div>
      ))}
    </div>
  );
};
