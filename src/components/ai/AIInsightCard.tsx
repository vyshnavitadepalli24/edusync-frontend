import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, AlertTriangle } from 'lucide-react';

interface AIInsightCardProps {
  title?: string;
  anomalyCount: number;
  message: string;
  affectedClass?: string;
  date?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH';
  onViewDetails?: () => void;
  className?: string;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title = 'AI Attendance Anomaly Detected',
  anomalyCount,
  message,
  affectedClass = 'CSE - 3rd Year (Sec A)',
  date = 'Today',
  severity = 'MEDIUM',
  onViewDetails,
  className = '',
}) => {
  const isHigh = severity === 'HIGH';

  return (
    <div
      className={`rounded-xl border p-5 transition-all bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/30 border-indigo-200/80 shadow-xs ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isHigh ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
            }`}
          >
            {isHigh ? <ShieldAlert className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 font-sans">
                {title}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-mono font-medium text-slate-500">{date}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-slate-600">{affectedClass}</span>
            </div>

            <p className="text-sm font-semibold text-slate-900 mt-1">{message}</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Engine scanned {anomalyCount} student session records comparing 9:00 AM FN roll-call with 1:30 PM AN lab logs.
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <span>View Anomaly Stream</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
