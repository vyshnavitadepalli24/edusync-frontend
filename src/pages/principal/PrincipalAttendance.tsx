import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Search,
  Eye,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { academicService } from '../../services/academicService';
import { AttendanceRecord, ClassRoom, AttendanceStatus } from '../../types';
import { AttendanceBadge, SessionBadge } from '../../components/common/Badges';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PrincipalAttendance: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [date, setDate] = useState('2026-09-27');
  const [selectedClassId, setSelectedClassId] = useState('cls_csea');
  const [sessionFilter, setSessionFilter] = useState<'ALL' | 'FN' | 'AN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'present' | 'absent' | 'anomaly'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'rollNo' | 'name' | 'overall'>('rollNo');
  const [sortAsc, setSortAsc] = useState(true);

  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    academicService.getClasses().then(setClasses);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    attendanceService
      .getAttendance({ classId: selectedClassId, date })
      .then((data) => setRecords(data))
      .finally(() => setIsLoading(false));
  }, [selectedClassId, date]);

  // Derived filter and sort
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = rec.studentName.toLowerCase().includes(q);
          const matchRoll = rec.studentRollNo.toLowerCase().includes(q);
          if (!matchName && !matchRoll) return false;
        }

        // Status filter
        if (statusFilter === 'present') {
          if (rec.fnStatus !== 'present' || rec.anStatus !== 'present') return false;
        } else if (statusFilter === 'absent') {
          if (rec.fnStatus !== 'absent' && rec.anStatus !== 'absent') return false;
        } else if (statusFilter === 'anomaly') {
          // Present in FN, Absent in AN
          if (!(rec.fnStatus === 'present' && rec.anStatus === 'absent')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'rollNo') {
          return sortAsc ? a.studentRollNo.localeCompare(b.studentRollNo) : b.studentRollNo.localeCompare(a.studentRollNo);
        }
        if (sortField === 'name') {
          return sortAsc ? a.studentName.localeCompare(b.studentName) : b.studentName.localeCompare(a.studentName);
        }
        return 0;
      });
  }, [records, searchQuery, statusFilter, sortField, sortAsc]);

  const rates = attendanceService.calculateClassRates(records);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Roll No,Student Name,Date,FN Status,AN Status,Remarks']
        .concat(
          records.map(
            (r) =>
              `${r.studentRollNo},"${r.studentName}",${r.date},${r.fnStatus.toUpperCase()},${r.anStatus.toUpperCase()},"${r.remarks || ''}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${selectedClassId}_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Export Initiated',
      message: `Exported ${records.length} records to CSV format.`,
    });
  };

  const handleSort = (field: 'rollNo' | 'name' | 'overall') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Attendance Monitoring Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit Forenoon (FN) and Afternoon (AN) institutional roll-call ledger
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onNavigate('/principal/anomalies')}
            className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scan Anomalies ({rates.anomalyCount})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">FN Attendance</span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-1">{rates.fnRate}%</div>
          <span className="text-xs text-slate-500">Forenoon Session</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">AN Attendance</span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-1">{rates.anRate}%</div>
          <span className="text-xs text-slate-500">Afternoon Session</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Full Presence</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">{rates.presentCount} / {records.length}</div>
          <span className="text-xs text-slate-500">Attended both sessions</span>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Session Skips</span>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">{rates.anomalyCount}</div>
          <span className="text-xs text-slate-500">FN Present / AN Absent</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Date Picker */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Class Selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Class & Section</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Records</option>
              <option value="present">Present in Both</option>
              <option value="absent">Absent in Either</option>
              <option value="anomaly">FN Present / AN Absent Only</option>
            </select>
          </div>

          {/* Search Bar */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">Quick Search</label>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter by name or roll..."
            />
          </div>
        </div>
      </div>

      {/* Main Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th
                  onClick={() => handleSort('rollNo')}
                  className="px-5 py-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Roll No</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-5 py-3 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-5 py-3 text-center">Forenoon (FN)</th>
                <th className="px-5 py-3 text-center">Afternoon (AN)</th>
                <th className="px-5 py-3">Day Outcome</th>
                <th className="px-5 py-3">Remarks / Verification</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No attendance records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isAnomaly = rec.fnStatus === 'present' && rec.anStatus === 'absent';
                  const isFullPresent = rec.fnStatus === 'present' && rec.anStatus === 'present';

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isAnomaly ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-900 tabular-nums">
                        {rec.studentRollNo}
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{rec.studentName}</div>
                        {isAnomaly && (
                          <span className="text-[10px] font-semibold text-amber-700 inline-flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Session Skip Detected
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <AttendanceBadge status={rec.fnStatus} />
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <AttendanceBadge status={rec.anStatus} />
                      </td>

                      <td className="px-5 py-3.5">
                        {isFullPresent ? (
                          <span className="text-emerald-700 font-semibold text-xs inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Full Day Present
                          </span>
                        ) : isAnomaly ? (
                          <span className="text-amber-800 font-semibold text-xs inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Half Day (FN Only)
                          </span>
                        ) : (
                          <span className="text-rose-700 font-semibold text-xs inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Absent
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 text-[11px] max-w-xs truncate">
                        {rec.remarks || <span className="text-slate-300">—</span>}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedStudentForHistory(rec)}
                          className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>History</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Attendance History Modal */}
      {selectedStudentForHistory && (
        <Modal
          isOpen={!!selectedStudentForHistory}
          onClose={() => setSelectedStudentForHistory(null)}
          title={`Attendance Audit: ${selectedStudentForHistory.studentName}`}
          subtitle={`Roll: ${selectedStudentForHistory.studentRollNo}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Overall Attendance</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">88.5%</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">FN Consistency</span>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">94.0%</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">AN Consistency</span>
                <div className="text-base font-bold font-mono text-amber-700 mt-0.5">83.0%</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">September 2026 Session Log</h4>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {[
                  { date: '2026-09-27', day: 'Fri', fn: 'present', an: 'absent', note: 'Left campus after FN lunch break' },
                  { date: '2026-09-26', day: 'Thu', fn: 'present', an: 'present' },
                  { date: '2026-09-25', day: 'Wed', fn: 'present', an: 'present' },
                  { date: '2026-09-24', day: 'Tue', fn: 'present', an: 'present' },
                  { date: '2026-09-23', day: 'Mon', fn: 'present', an: 'present' },
                  { date: '2026-09-22', day: 'Fri', fn: 'present', an: 'absent', note: 'Friday lab session miss' },
                  { date: '2026-09-21', day: 'Thu', fn: 'present', an: 'present' },
                  { date: '2026-09-15', day: 'Fri', fn: 'present', an: 'absent', note: 'Friday lab session miss' },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-600">{row.date}</span>
                      <span className="text-slate-400">({row.day})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-[11px]">FN:</span>
                        <AttendanceBadge status={row.fn as AttendanceStatus} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-[11px]">AN:</span>
                        <AttendanceBadge status={row.an as AttendanceStatus} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudentForHistory(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
