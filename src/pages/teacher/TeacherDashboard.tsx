import React from 'react';
import {
  Layers,
  Users,
  CalendarCheck,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react';
import { KPICard } from '../../components/common/KPICard';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { useERPData } from '../../context/ERPDataContext';

export const TeacherDashboard: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { requests, anomalies } = useERPData();

  const myRequests = requests.filter((r) => r.teacherName.includes('Anitha'));
  const myAnomalies = anomalies.filter((a) => a.className.includes('CSE - 3rd Year'));

  const todayClasses = [
    {
      time: '09:00 AM - 10:30 AM',
      name: 'CSE - 3rd Year (Sec A)',
      subject: 'Data Structures & Algorithms',
      room: 'CS-Lab 304',
      status: 'FN Roll-Call Completed (93.8%)',
      isDone: true,
    },
    {
      time: '11:00 AM - 12:30 PM',
      name: 'CSE - 4th Year (Sec B)',
      subject: 'Database Systems Architecture',
      room: 'Lecture Hall 102',
      status: 'FN Roll-Call Completed (90.0%)',
      isDone: true,
    },
    {
      time: '01:30 PM - 03:30 PM',
      name: 'CSE - 3rd Year (Sec A)',
      subject: 'Algorithms Lab Evaluation (AN Session)',
      room: 'CS-Lab 304',
      status: 'AN Attendance Synchronized (84.4%)',
      isDone: true,
    },
    {
      time: '03:45 PM - 04:30 PM',
      name: 'Department Faculty Meeting',
      subject: 'Academic Syllabus Scrutiny',
      room: 'Conference Room 2',
      status: 'Upcoming',
      isDone: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Faculty Academic Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Welcome back, Prof. Anitha Vasudevan · Computer Science & Engineering
          </p>
        </div>

        <button
          onClick={() => onNavigate('/teacher/attendance')}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Launch Today's Attendance Engine</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Assigned Classes"
          value="2 Classes"
          subtext="CSE-3A & CSE-4B"
          icon={<Layers className="w-4 h-4" />}
          accent="primary"
          onClick={() => onNavigate('/teacher/classes')}
        />
        <KPICard
          label="Total Students"
          value="62"
          subtext="Under active mentoring"
          icon={<Users className="w-4 h-4" />}
        />
        <KPICard
          label="Today's Attendance"
          value="93.8% FN"
          subtext="AN: 84.4% (3 session skips)"
          icon={<CalendarCheck className="w-4 h-4" />}
          trend={{ value: 'Saved Today', isPositive: true }}
          accent="success"
          onClick={() => onNavigate('/teacher/attendance')}
        />
        <KPICard
          label="My Pending Requests"
          value={myRequests.filter((r) => r.status === 'Pending').length}
          subtext="Awaiting Principal sign-off"
          icon={<FileCheck2 className="w-4 h-4" />}
          accent="warning"
          onClick={() => onNavigate('/teacher/requests')}
        />
      </div>

      {/* AI Alerts for Teacher */}
      <AIInsightCard
        title="Teacher Advisory: Session Drop-off Alert"
        anomalyCount={myAnomalies.length}
        message="3 students in your afternoon Algorithms Lab were present in Forenoon but missed the lab session."
        affectedClass="CSE - 3rd Year (Sec A)"
        severity="MEDIUM"
        onViewDetails={() => onNavigate('/teacher/attendance')}
      />

      {/* Two Column Layout: Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Timetable (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Today's Class Schedule</h3>
              <p className="text-[11px] text-slate-500">Forenoon & Afternoon instructional sessions</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Sep 27, 2026 (Friday)</span>
          </div>

          <div className="space-y-3">
            {todayClasses.map((cls, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-blue-600 font-mono text-[11px] font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cls.name}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 font-mono">{cls.room}</span>
                    </div>
                    <p className="text-slate-600 font-medium mt-0.5">{cls.subject}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{cls.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                      cls.isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Marks (1 Col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              Faculty Workflows
            </h3>
            <button
              onClick={() => onNavigate('/teacher/attendance')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark FN / AN Attendance</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/teacher/marks')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Enter Examination Marks</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigate('/teacher/requests')}
              className="w-full p-3 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-amber-600" />
                <span>Request Correction (Principal)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              Recent Marks Entry
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Mid-Term 1: Data Structures</span>
                  <div className="text-[11px] text-slate-500">CSE - 3rd Year (Sec A)</div>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold">100% Submitted</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900">Unit Test 2: DBMS</span>
                  <div className="text-[11px] text-slate-500">CSE - 3rd Year (Sec A)</div>
                </div>
                <span className="text-[11px] font-mono text-amber-700 font-bold">Draft in progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
