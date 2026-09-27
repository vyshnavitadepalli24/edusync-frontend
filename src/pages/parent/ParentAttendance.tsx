import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceStatus } from '../../types';
import { AttendanceBadge } from '../../components/common/Badges';

export const ParentAttendance: React.FC = () => {
  const [viewMode, setViewMode] = useState<'Monthly' | 'Daily' | 'Range'>('Monthly');
  const [days, setDays] = useState<{
    date: string;
    dayName: string;
    fnStatus: AttendanceStatus;
    anStatus: AttendanceStatus;
  }[]>([]);

  useEffect(() => {
    attendanceService.getStudentMonthlyAttendance('std_101', '2026-09').then(setDays);
  }, []);

  const totalDays = days.length;
  const fnPresent = days.filter((d) => d.fnStatus === 'present').length;
  const anPresent = days.filter((d) => d.anStatus === 'present').length;
  const fnRate = totalDays > 0 ? Math.round((fnPresent / totalDays) * 1000) / 10 : 0;
  const anRate = totalDays > 0 ? Math.round((anPresent / totalDays) * 1000) / 10 : 0;
  const overallRate = totalDays > 0 ? Math.round(((fnPresent + anPresent) / (totalDays * 2)) * 1000) / 10 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Attendance Calendar & Audit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily Forenoon (FN) & Afternoon (AN) session breakdown for Rahul Kumar (21CS001)
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
          {(['Monthly', 'Daily', 'Range'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === mode ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Combined Attendance
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{overallRate}%</div>
          <span className="text-xs text-emerald-700 font-semibold">Meets 75% Academic Requirement</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Forenoon (FN Session)
          </span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{fnRate}%</div>
          <span className="text-xs text-slate-500">{fnPresent} of {totalDays} sessions attended</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Afternoon (AN Session)
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{anRate}%</div>
          <span className="text-xs text-amber-700 font-semibold">{totalDays - anPresent} sessions missed</span>
        </div>
      </div>

      {/* Calendar History View */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              September 2026 Session Matrix
            </h3>
            <p className="text-[11px] text-slate-500">Each instructional day logs Forenoon (FN) & Afternoon (AN)</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 text-[11px]">Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-600 text-[11px]">Absent</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid of Days */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
          {days.map((item, idx) => {
            const isAnomaly = item.fnStatus === 'present' && item.anStatus === 'absent';
            const isBothAbsent = item.fnStatus === 'absent' && item.anStatus === 'absent';

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs transition-colors ${
                  isAnomaly
                    ? 'border-amber-300 bg-amber-50/40'
                    : isBothAbsent
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between font-mono pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800">{item.date.split('-')[2]} Sep</span>
                  <span className="text-[10px] text-slate-400 font-sans">{item.dayName}</span>
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">FN:</span>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.fnStatus === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.fnStatus === 'present' ? 'P' : 'A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">AN:</span>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        item.anStatus === 'present'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.anStatus === 'present' ? 'P' : 'A'}
                    </span>
                  </div>
                </div>

                {isAnomaly && (
                  <div className="mt-1.5 pt-1 border-t border-amber-200/60 text-[9px] font-semibold text-amber-800 text-center">
                    AN Missed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
