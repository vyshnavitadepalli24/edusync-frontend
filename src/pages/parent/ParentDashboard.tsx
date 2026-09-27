import React from 'react';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { KPICard } from '../../components/common/KPICard';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { useERPData } from '../../context/ERPDataContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ParentDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { notifications } = useERPData();

  const parentNotifs = notifications.filter((n) => n.recipientRole === 'parent').slice(0, 3);

  const examSummary = [
    { subject: 'Data Structures', marks: 84, grade: 'A' },
    { subject: 'DBMS', marks: 91, grade: 'A+' },
    { subject: 'Java OOP', marks: 89, grade: 'A' },
    { subject: 'Comp. Networks', marks: 76, grade: 'B+' },
    { subject: 'OS Principles', marks: 82, grade: 'A' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Guardian Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Student Monitoring & AI Academic Telemetry for <strong>Rahul Kumar</strong> (21CS001)
          </p>
        </div>

        <button
          onClick={() => onNavigate('/parent/progress')}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>View AI Cognitive Progress Summary</span>
        </button>
      </div>

      {/* Student Profile Snapshot Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 font-black text-lg flex items-center justify-center border border-purple-200 shrink-0">
            RK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Rahul Kumar</h2>
              <span className="text-xs font-mono font-semibold text-slate-500 px-2 py-0.2 bg-slate-100 rounded">
                21CS001
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              CSE - 3rd Year (Sec A) · Class Teacher: Prof. Anitha Vasudevan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto text-xs">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Semester GPA</span>
            <div className="font-mono font-bold text-purple-700 text-lg">8.7 / 10</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Statutory Status</span>
            <div className="font-semibold text-emerald-700">Eligible (88.5%)</div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Overall Attendance"
          value="88.5%"
          subtext="Target benchmark: ≥ 75%"
          icon={<CalendarCheck className="w-4 h-4" />}
          trend={{ value: 'Normal', isPositive: true }}
          accent="primary"
          onClick={() => onNavigate('/parent/attendance')}
        />
        <KPICard
          label="Forenoon (FN)"
          value="94.0%"
          subtext="High lecture attendance"
          trend={{ value: 'Top 10%', isPositive: true }}
          accent="success"
        />
        <KPICard
          label="Afternoon (AN)"
          value="83.0%"
          subtext="11% variance detected"
          trend={{ value: 'Attention needed', isPositive: false }}
          accent="warning"
        />
        <KPICard
          label="Exam Average"
          value="84.4%"
          subtext="Mid-Term 1 assessment"
          icon={<Award className="w-4 h-4" />}
          accent="ai"
          onClick={() => onNavigate('/parent/marks')}
        />
      </div>

      {/* Real-time Session Warning Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="font-bold text-amber-950">Afternoon Session Absence Alert:</strong>
          <span className="text-amber-900 ml-1">
            Rahul was marked Present during the Forenoon session (9:00 AM) but registered Absent during the Afternoon session today (Sep 27). If this departure was pre-authorized, please confirm with Prof. Anitha.
          </span>
        </div>
      </div>

      {/* Two Column Layout: Recent Results & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mid-Term 1 Report Card Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Mid-Term 1 Performance
              </h3>
              <p className="text-[11px] text-slate-500">Official published evaluation marks</p>
            </div>
            <button
              onClick={() => onNavigate('/parent/marks')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Full Report Card →
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {examSummary.map((sub, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{sub.subject}</span>
                  <div className="text-[11px] text-slate-400">Theory Paper (100 Marks)</div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-800 text-sm">{sub.marks} / 100</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      sub.grade === 'A+' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {sub.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications and Institutional Broadcasts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Institutional Alerts for Guardian
              </h3>
              <p className="text-[11px] text-slate-500">Dispatches from Principal & Class Teacher</p>
            </div>
            <button
              onClick={() => onNavigate('/parent/notifications')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {parentNotifs.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] font-mono text-slate-400">{n.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
