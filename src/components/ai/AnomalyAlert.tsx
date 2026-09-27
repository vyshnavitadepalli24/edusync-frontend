import React from 'react';
import { AlertTriangle, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { AIAnomaly } from '../../types';
import { AIRiskBadge, AttendanceBadge } from '../common/Badges';

interface AnomalyAlertProps {
  anomaly: AIAnomaly;
  onReview?: (id: string) => void;
  onViewStudent?: (studentId: string) => void;
  onViewAttendance?: (studentId: string) => void;
}

export const AnomalyAlert: React.FC<AnomalyAlertProps> = ({
  anomaly,
  onReview,
  onViewStudent,
  onViewAttendance,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all ${
        anomaly.isReviewed
          ? 'border-slate-200/80 bg-slate-50/50 opacity-80'
          : anomaly.riskLevel === 'HIGH'
          ? 'border-rose-200 hover:border-rose-300'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-slate-900">{anomaly.studentName}</span>
          <span className="text-xs font-mono text-slate-500 tabular-nums">{anomaly.studentRollNo}</span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-600">{anomaly.className}</span>
        </div>

        <div className="flex items-center gap-2">
          <AIRiskBadge risk={anomaly.riskLevel} />
          {anomaly.isReviewed ? (
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Reviewed
            </span>
          ) : (
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              Action Required
            </span>
          )}
        </div>
      </div>

      <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Session Status</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">FN:</span>
            <AttendanceBadge status={anomaly.fnStatus} />
            <span className="text-slate-300">/</span>
            <span className="text-xs text-slate-600">AN:</span>
            <AttendanceBadge status={anomaly.anStatus} />
          </div>
        </div>

        <div className="md:col-span-2 space-y-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Detected Anomaly: {anomaly.anomalyType}
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{anomaly.description}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{anomaly.detectedAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {onViewStudent && (
            <button
              onClick={() => onViewStudent(anomaly.studentId)}
              className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              View Student
            </button>
          )}

          {onViewAttendance && (
            <button
              onClick={() => onViewAttendance(anomaly.studentId)}
              className="px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            >
              View Attendance
            </button>
          )}

          {!anomaly.isReviewed && onReview && (
            <button
              onClick={() => onReview(anomaly.id)}
              className="inline-flex items-center gap-1 px-3 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Mark Reviewed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
