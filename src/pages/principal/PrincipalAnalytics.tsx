import React, { useState } from 'react';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Award,
  Calendar,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { KPICard } from '../../components/common/KPICard';

export const PrincipalAnalytics: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [selectedTerm, setSelectedTerm] = useState('Fall 2026 (Semester V)');

  const monthlyAttendanceData = [
    { month: 'Jun', fn: 95.2, an: 93.1, combined: 94.1 },
    { month: 'Jul', fn: 96.0, an: 91.8, combined: 93.9 },
    { month: 'Aug', fn: 94.5, an: 88.4, combined: 91.4 },
    { month: 'Sep', fn: 93.8, an: 84.4, combined: 89.1 }, // Growing divergence
  ];

  const departmentPerformance = [
    { dept: 'Computer Science', passRate: 94.2, avgMarks: 82.5, attendance: 90.2 },
    { dept: 'Electronics & Comm.', passRate: 96.8, avgMarks: 85.1, attendance: 94.6 },
    { dept: 'Mechanical Engg.', passRate: 88.0, avgMarks: 76.4, attendance: 84.2 },
    { dept: 'Information Tech.', passRate: 91.5, avgMarks: 79.8, attendance: 88.7 },
  ];

  const attendanceDistribution = [
    { name: 'Excellent (≥ 90%)', value: 68, color: '#10b981' },
    { name: 'Good (80% - 89%)', value: 38, color: '#3b82f6' },
    { name: 'Marginal (75% - 79%)', value: 12, color: '#f59e0b' },
    { name: 'At Risk (< 75%)', value: 7, color: '#ef4444' },
  ];

  const studentsAtRisk = [
    { name: 'Rohan Verma', roll: '21CS005', class: 'CSE-3A', attendance: 71.5, gpa: 7.1, reason: 'Streak absence, below statutory 75%' },
    { name: 'Karthik Ramanathan', roll: '21CS009', class: 'CSE-3A', attendance: 78.0, gpa: 7.8, reason: 'Recurring Friday AN session drop' },
    { name: 'G. Vignesh', roll: '21ME014', class: 'MECH-3A', attendance: 69.2, gpa: 6.8, reason: 'High unexcused workshop absence' },
    { name: 'Swetha Ram', roll: '21EC021', class: 'ECE-2A', attendance: 74.0, gpa: 7.9, reason: 'Medical absence backlog' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Academic & Attendance Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional longitudinal trends, FN vs AN attrition curve, and risk intervention cohort
          </p>
        </div>

        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
        >
          <option value="Fall 2026 (Semester V)">Fall 2026 (Semester V)</option>
          <option value="Spring 2026 (Semester IV)">Spring 2026 (Semester IV)</option>
        </select>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Forenoon Retention"
          value="94.8%"
          subtext="High lecture attendance"
          trend={{ value: '+0.6% vs Aug', isPositive: true }}
          accent="success"
        />
        <KPICard
          label="Afternoon Drop Rate"
          value="-9.4%"
          subtext="Session divergence metric"
          trend={{ value: 'Action Required', isPositive: false }}
          accent="warning"
        />
        <KPICard
          label="Mean Institutional GPA"
          value="8.42"
          subtext="Out of 10.0 scale"
          trend={{ value: '+0.15 YoY', isPositive: true }}
          accent="primary"
        />
        <KPICard
          label="At-Risk Cohort"
          value="7 Students"
          subtext="Below 75% attendance threshold"
          trend={{ value: 'Immediate Advisory', isPositive: false }}
          accent="danger"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forenoon vs Afternoon Divergence Area Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Monthly FN vs AN Session Divergence
              </h3>
              <p className="text-[11px] text-slate-500">Noticeable widening gap between morning & post-lunch hours</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">June – Sept</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fnGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="fn" name="Forenoon (FN) %" stroke="#3b82f6" fill="url(#fnGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="an" name="Afternoon (AN) %" stroke="#f59e0b" fill="url(#anGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Comparison Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Department Performance Benchmarks
              </h3>
              <p className="text-[11px] text-slate-500">Exam pass percentage vs overall attendance</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Mid-Term 1</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dept" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Bottom: Attendance Pie Distribution & At Risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
            Student Attendance Distribution
          </h3>
          <p className="text-[11px] text-slate-500 mb-4">Based on semester minimum 75% rule</p>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {attendanceDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-800 text-[11px]">{item.value} stds</span>
              </div>
            ))}
          </div>
        </div>

        {/* At Risk Intervention Cohort (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Intervention Cohort (Attendance Shortage)
              </h3>
              <p className="text-[11px] text-slate-500">Students needing immediate guardian counselling prior to semester exams</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded">
              High Priority
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {studentsAtRisk.map((st, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{st.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">{st.roll}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600">{st.class}</span>
                  </div>
                  <p className="text-[11px] text-rose-600 mt-0.5">{st.reason}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-rose-600 text-sm">{st.attendance}%</div>
                    <div className="text-[10px] text-slate-400 font-mono">GPA: {st.gpa}</div>
                  </div>

                  <button
                    onClick={() => onNavigate('/principal/parents')}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-200 rounded transition-colors cursor-pointer"
                  >
                    Parent Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
