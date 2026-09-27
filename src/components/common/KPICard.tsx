import React from 'react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  onClick?: () => void;
  accent?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ai';
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  onClick,
  accent = 'default',
}) => {
  const accentTopBorder =
    accent === 'primary'
      ? 'border-t-2 border-t-blue-600'
      : accent === 'success'
      ? 'border-t-2 border-t-emerald-600'
      : accent === 'warning'
      ? 'border-t-2 border-t-amber-500'
      : accent === 'danger'
      ? 'border-t-2 border-t-rose-600'
      : accent === 'ai'
      ? 'border-t-2 border-t-indigo-600'
      : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-5 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      } ${accentTopBorder}`}
    >
      <div className="flex items-center justify-between text-slate-500 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
        {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {value}
        </span>
        {trend && (
          <span
            className={`text-xs font-medium tabular-nums ${
              trend.isNeutral
                ? 'text-slate-500'
                : trend.isPositive
                ? 'text-emerald-700'
                : 'text-rose-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtext && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{subtext}</p>}
    </div>
  );
};
