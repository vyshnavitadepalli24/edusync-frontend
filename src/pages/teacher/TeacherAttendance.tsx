import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Users,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { academicService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';
import { Student, AttendanceStatus, ClassRoom } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useERPData } from '../../context/ERPDataContext';

interface StudentAttendanceRow {
  studentId: string;
  studentRollNo: string;
  studentName: string;
  fnStatus: AttendanceStatus;
  anStatus: AttendanceStatus;
  remarks: string;
}

export const TeacherAttendance: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { addToast } = useToast();
  const { refreshData } = useERPData();

  const [date, setDate] = useState('2026-09-27');
  const [selectedClassId, setSelectedClassId] = useState('cls_csea');
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [rows, setRows] = useState<StudentAttendanceRow[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavedSuccessfully, setIsSavedSuccessfully] = useState(false);

  useEffect(() => {
    academicService.getClasses().then(setClasses);
  }, []);

  // Load students and initialize attendance state
  useEffect(() => {
    academicService.getStudents(selectedClassId).then((students) => {
      // Set initial statuses (with Rahul, Priya, Karthik demonstrating session skipping on 2026-09-27)
      const mapped: StudentAttendanceRow[] = students.map((s) => {
        let fn: AttendanceStatus = 'present';
        let an: AttendanceStatus = 'present';
        let remarks = '';

        if (s.rollNo === '21CS001') {
          // Rahul Kumar: Session skip
          fn = 'present';
          an = 'absent';
          remarks = 'Left campus after FN lunch break';
        } else if (s.rollNo === '21CS004') {
          // Priya Nair: Session skip
          fn = 'present';
          an = 'absent';
          remarks = 'Medical clinic slip pending review';
        } else if (s.rollNo === '21CS005') {
          // Rohan Verma: Absent both
          fn = 'absent';
          an = 'absent';
          remarks = 'Uninformed full-day absence';
        } else if (s.rollNo === '21CS009') {
          // Karthik Ramanathan: Session skip
          fn = 'present';
          an = 'absent';
          remarks = 'Unreported AN miss';
        }

        return {
          studentId: s.id,
          studentRollNo: s.rollNo,
          studentName: s.name,
          fnStatus: fn,
          anStatus: an,
          remarks,
        };
      });
      setRows(mapped);
      setIsSavedSuccessfully(false);
    });
  }, [selectedClassId, date]);

  // Bulk actions
  const markAllFN = (status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, fnStatus: status })));
    setIsSavedSuccessfully(false);
  };

  const markAllAN = (status: AttendanceStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, anStatus: status })));
    setIsSavedSuccessfully(false);
  };

  const toggleStatus = (studentId: string, session: 'FN' | 'AN') => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          if (session === 'FN') {
            return { ...r, fnStatus: r.fnStatus === 'present' ? 'absent' : 'present' };
          } else {
            return { ...r, anStatus: r.anStatus === 'present' ? 'absent' : 'present' };
          }
        }
        return r;
      })
    );
    setIsSavedSuccessfully(false);
  };

  const handleRemarkChange = (studentId: string, val: string) => {
    setRows((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remarks: val } : r))
    );
  };

  // Calculations
  const total = rows.length;
  const fnPresent = rows.filter((r) => r.fnStatus === 'present').length;
  const anPresent = rows.filter((r) => r.anStatus === 'present').length;
  const fnRate = total > 0 ? Math.round((fnPresent / total) * 1000) / 10 : 0;
  const anRate = total > 0 ? Math.round((anPresent / total) * 1000) / 10 : 0;
  const sessionSkips = rows.filter((r) => r.fnStatus === 'present' && r.anStatus === 'absent').length;

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const res = await attendanceService.saveClassAttendance({
        classId: selectedClassId,
        date,
        records: rows,
        markedByTeacherId: 'usr_t1',
      });

      setIsSavedSuccessfully(true);
      await refreshData();

      addToast({
        type: 'success',
        title: 'Attendance Finalized',
        message: `Saved ${res.savedCount} student records for ${date}. Dispatched ${res.anomaliesFound} session-skip anomaly alerts to Principal telemetry.`,
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Unable to commit records to ERP. Please retry.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Daily Attendance Authoring Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log official Forenoon (FN 09:00 AM) and Afternoon (AN 01:30 PM) instructional roll-calls
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSavedSuccessfully && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Finalized & Synced</span>
            </span>
          )}

          <button
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Synchronizing...' : 'Save & Lock Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Selectors and Metrics Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Roll-Call Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Assigned Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 border border-slate-200 rounded-lg focus:outline-hidden"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex flex-col justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-700">
              Forenoon (FN) Attendance
            </span>
            <div className="text-xl font-bold font-mono text-blue-900 mt-0.5">
              {fnRate}% <span className="text-xs font-sans text-blue-600 font-normal">({fnPresent}/{total})</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100 flex flex-col justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700">
              Afternoon (AN) Attendance
            </span>
            <div className="text-xl font-bold font-mono text-amber-900 mt-0.5">
              {anRate}% <span className="text-xs font-sans text-amber-600 font-normal">({anPresent}/{total})</span>
            </div>
          </div>
        </div>

        {/* Quick Batch Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500 text-[11px] uppercase tracking-wider mr-1">
              Bulk Roll-Call:
            </span>
            <button
              type="button"
              onClick={() => markAllFN('present')}
              className="px-2.5 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
            >
              All FN Present
            </button>
            <button
              type="button"
              onClick={() => markAllFN('absent')}
              className="px-2.5 py-1 font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
            >
              All FN Absent
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => markAllAN('present')}
              className="px-2.5 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
            >
              All AN Present
            </button>
            <button
              type="button"
              onClick={() => markAllAN('absent')}
              className="px-2.5 py-1 font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
            >
              All AN Absent
            </button>
          </div>

          {sessionSkips > 0 && (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{sessionSkips} Session Skips will be flagged to Principal</span>
            </div>
          )}
        </div>
      </div>

      {/* Attendance Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3.5 w-16">#</th>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5 text-center w-36">Forenoon (FN)</th>
                <th className="px-5 py-3.5 text-center w-36">Afternoon (AN)</th>
                <th className="px-5 py-3.5">Day Outcome</th>
                <th className="px-5 py-3.5">Faculty Remarks</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((row, index) => {
                const isAnomaly = row.fnStatus === 'present' && row.anStatus === 'absent';
                const isBothPresent = row.fnStatus === 'present' && row.anStatus === 'present';
                const isBothAbsent = row.fnStatus === 'absent' && row.anStatus === 'absent';

                return (
                  <tr
                    key={row.studentId}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isAnomaly ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="px-5 py-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>

                    <td className="px-5 py-3 font-mono font-bold text-slate-900 tabular-nums">
                      {row.studentRollNo}
                    </td>

                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900">{row.studentName}</div>
                      {isAnomaly && (
                        <span className="text-[10px] text-amber-700 font-semibold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                          Session Skip
                        </span>
                      )}
                    </td>

                    {/* FN Toggle */}
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(row.studentId, 'FN')}
                        className={`w-28 py-1.5 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
                          row.fnStatus === 'present'
                            ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                            : 'bg-rose-600 text-white border-rose-700 hover:bg-rose-500'
                        }`}
                      >
                        {row.fnStatus === 'present' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* AN Toggle */}
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(row.studentId, 'AN')}
                        className={`w-28 py-1.5 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border shadow-2xs ${
                          row.anStatus === 'present'
                            ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-500'
                            : 'bg-rose-600 text-white border-rose-700 hover:bg-rose-500'
                        }`}
                      >
                        {row.anStatus === 'present' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Day Outcome */}
                    <td className="px-5 py-3">
                      {isBothPresent ? (
                        <span className="text-emerald-700 font-semibold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Full Day
                        </span>
                      ) : isAnomaly ? (
                        <span className="text-amber-800 font-semibold text-xs inline-flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Half Day (FN)
                        </span>
                      ) : isBothAbsent ? (
                        <span className="text-rose-700 font-semibold text-xs inline-flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Absent
                        </span>
                      ) : (
                        <span className="text-blue-700 font-semibold text-xs">Half Day (AN)</span>
                      )}
                    </td>

                    {/* Remarks Input */}
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) => handleRemarkChange(row.studentId, e.target.value)}
                        placeholder="Optional remarks (e.g. medical slip)..."
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded focus:outline-hidden focus:border-blue-500 bg-white placeholder:text-slate-400"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="text-xs text-slate-500">
          Faculty signature committed under Dr. Ramesh Sundaram's institutional ERP oversight.
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/teacher/requests')}
            className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
          >
            Submit Correction Request
          </button>

          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Committing...' : 'Commit & Lock Today\'s Roll'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
