import React from 'react';
import { AttendanceStatus } from '../../types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const AttendanceBadge: React.FC<{
  status: AttendanceStatus;
  label?: string;
  size?: 'sm' | 'md';
}> = ({ status, label, size = 'sm' }) => {
  const isPresent = status === 'present';
  const isLate = status === 'late';
  const isExcused = status === 'excused';

  const text = label || (isPresent ? 'Present' : isLate ? 'Late' : isExcused ? 'Excused' : 'Absent');

  const colorStyles = isPresent
    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
    : isLate
    ? 'bg-amber-50 text-amber-800 border-amber-200'
    : isExcused
    ? 'bg-blue-50 text-blue-800 border-blue-200'
    : 'bg-rose-50 text-rose-800 border-rose-200';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      } ${colorStyles}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isPresent ? 'bg-emerald-600' : isLate ? 'bg-amber-500' : isExcused ? 'bg-blue-500' : 'bg-rose-600'
        }`}
      />
      {text}
    </span>
  );
};

export const SessionBadge: React.FC<{
  session: 'FN' | 'AN';
  status: AttendanceStatus;
}> = ({ session, status }) => {
  const isPresent = status === 'present';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded border tabular-nums ${
        isPresent
          ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200'
          : 'bg-rose-50/80 text-rose-800 border-rose-200'
      }`}
    >
      <span className="text-[10px] font-bold text-slate-500">{session}:</span>
      <span>{isPresent ? 'P' : 'A'}</span>
    </span>
  );
};

export const AIRiskBadge: React.FC<{
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  className?: string;
}> = ({ risk, className = '' }) => {
  if (risk === 'LOW') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded border bg-emerald-50 text-emerald-800 border-emerald-200 ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Low Risk
      </span>
    );
  }

  if (risk === 'MEDIUM') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded border bg-amber-50 text-amber-800 border-amber-200 ${className}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        Medium Risk
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded border bg-rose-50 text-rose-800 border-rose-200 ${className}`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
      High Risk
    </span>
  );
};

export const AIConfidenceBadge: React.FC<{
  confidence: number;
  className?: string;
}> = ({ confidence, className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded border tabular-nums bg-indigo-50 text-indigo-800 border-indigo-200 ${className}`}
    >
      <span className="text-[11px] text-indigo-500 font-sans">AI Confidence</span>
      <span>{confidence}%</span>
    </span>
  );
};

export const StatusBadge: React.FC<{
  status: string;
  className?: string;
}> = ({ status, className = '' }) => {
  const s = status.toLowerCase();
  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (s.includes('active') || s.includes('approved') || s.includes('verified')) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (s.includes('pending') || s.includes('leave')) {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (s.includes('rejected') || s.includes('suspended')) {
    style = 'bg-rose-50 text-rose-800 border-rose-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${style} ${className}`}
    >
      {status}
    </span>
  );
};
