import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { KPICard } from '../../components/common/KPICard';
import { Users, Award, TrendingUp, AlertTriangle } from 'lucide-react';

export const TeacherAnalytics: React.FC = () => {
  const cseAttendanceTrend = [
    { week: 'W1', fn: 96.0, an: 92.5 },
    { week: 'W2', fn: 95.2, an: 90.0 },
    { week: 'W3', fn: 94.0, an: 87.5 },
    { week: 'W4', fn: 93.8, an: 84.4 },
  ];

  const subjectPerformance = [
    { subject: 'Data Structures', topScore: 98, avgScore: 84, minScore: 62 },
    { subject: 'DBMS', topScore: 96, avgScore: 82, minScore: 58 },
    { subject: 'Java OOP', topScore: 95, avgScore: 80, minScore: 55 },
  ];

  const attentionList = [
    { name: 'Rohan Verma', roll: '21CS005', attendance: '71.5%', issue: 'Repeated lab absence; marks in Data Structures below 70' },
    { name: 'Karthik Ramanathan', roll: '21CS009', attendance: '78.0%', issue: 'Divergent AN attendance pattern on Fridays' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Class Academic Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          CSE - 3rd Year (Sec A) · Instructional performance and session drop-off diagnostics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Class Strength"
          value="32 Students"
          subtext="Full enrolment CSE-3A"
          icon={<Users className="w-4 h-4" />}
          accent="primary"
        />
        <KPICard
          label="Subject Average"
          value="84.2%"
          subtext="Data Structures (CS301)"
          trend={{ value: '+3.1% YoY', isPositive: true }}
          icon={<Award className="w-4 h-4" />}
          accent="success"
        />
        <KPICard
          label="FN Attendance"
          value="93.8%"
          subtext="Consistent morning lectures"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <KPICard
          label="AN Drop-Off"
          value="-9.4%"
          subtext="Afternoon session skip gap"
          icon={<AlertTriangle className="w-4 h-4" />}
          accent="warning"
        />
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Trend */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                CSE-3A Weekly FN vs AN Attendance Trend
              </h3>
              <p className="text-[11px] text-slate-500">Comparing Forenoon lecture presence vs Afternoon lab presence</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cseAttendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="fn" name="Forenoon (FN) %" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="an" name="Afternoon (AN) %" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Grade Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Mid-Term 1 Score Ranges
              </h3>
              <p className="text-[11px] text-slate-500">Top score vs class average score</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="topScore" name="Top Score" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgScore" name="Class Average" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Students Requiring Intervention */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
          Students Requiring Academic Mentoring
        </h3>

        <div className="divide-y divide-slate-100">
          {attentionList.map((st, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{st.name}</span>
                <span className="font-mono text-slate-500 ml-2">({st.roll})</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{st.issue}</p>
              </div>
              <div className="text-right font-mono font-bold text-rose-600">
                {st.attendance}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
