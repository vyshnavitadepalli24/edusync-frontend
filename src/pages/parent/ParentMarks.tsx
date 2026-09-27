import React, { useState, useEffect } from 'react';
import { Award, BarChart3, Download, CheckCircle2 } from 'lucide-react';
import { academicService } from '../../services/academicService';
import { ExamMarkRecord } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useToast } from '../../context/ToastContext';

export const ParentMarks: React.FC = () => {
  const { addToast } = useToast();
  const [marks, setMarks] = useState<ExamMarkRecord[]>([]);

  useEffect(() => {
    academicService.getExamMarks({ studentId: 'std_101' }).then(setMarks);
  }, []);

  const totalObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0);
  const aggregatePct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;

  const chartData = marks.map((m) => ({
    subject: m.subject.replace(' & Algorithms', '').replace('Management Systems', ''),
    score: m.marksObtained,
    max: m.maxMarks,
    grade: m.grade,
  }));

  const handleDownloadReport = () => {
    addToast({
      type: 'success',
      title: 'Report Card Generated',
      message: 'Downloading cryptographically signed Grade Transcript PDF for Rahul Kumar.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Academic Report Card</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Internal evaluation transcript for Rahul Kumar (21CS001) · Semester V
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Download PDF Transcript</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Aggregate Percentage
          </span>
          <div className="text-2xl font-bold font-mono text-purple-700 mt-1">{aggregatePct}%</div>
          <span className="text-xs text-slate-500">{totalObtained} / {totalMax} Marks Secured</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Cumulative GPA
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">8.7 / 10</div>
          <span className="text-xs text-emerald-700 font-semibold">First Class with Distinction</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Institutional Standing
          </span>
          <div className="text-2xl font-bold font-mono text-blue-700 mt-1">Top 8%</div>
          <span className="text-xs text-slate-500">Ranked 3rd in Section A</span>
        </div>
      </div>

      {/* Subject-wise Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Subject Score Distribution (Out of 100)
            </h3>
            <p className="text-[11px] text-slate-500">Peak performance achieved in Database Systems & Java</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="score" name="Marks Secured" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Marks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Course / Subject</th>
                <th className="px-5 py-3">Examination</th>
                <th className="px-5 py-3 text-center">Marks Obtained</th>
                <th className="px-5 py-3 text-center">Maximum Marks</th>
                <th className="px-5 py-3 text-center">Percentage</th>
                <th className="px-5 py-3 text-center">Letter Grade</th>
                <th className="px-5 py-3">Faculty Scrutiny</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {marks.map((m) => {
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);

                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{m.subject}</td>
                    <td className="px-5 py-3.5 text-slate-500">{m.examName}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-900 text-sm">
                      {m.marksObtained}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-slate-400">{m.maxMarks}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-slate-800">{pct}%</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-block font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          m.grade === 'A+' || m.grade === 'O'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {m.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
