import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { AIParentSummary } from '../../types';

interface AIProgressSummaryProps {
  summary: AIParentSummary;
  onRegenerate: () => Promise<void>;
  isLoading?: boolean;
}

export const AIProgressSummary: React.FC<AIProgressSummaryProps> = ({
  summary,
  onRegenerate,
  isLoading = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRegenerate();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-indigo-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">AI Academic Progress Summary</h3>
            <p className="text-xs text-slate-500">Natural-language cognitive digest synthesized from attendance & exam ledgers</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading || isRefreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
          <span>{isRefreshing || isLoading ? 'Synthesizing...' : 'Regenerate Summary'}</span>
        </button>
      </div>

      {/* Main Narrative */}
      <div className="p-6 space-y-6">
        <div className="text-sm text-slate-800 leading-relaxed bg-slate-50/80 border border-slate-200/60 rounded-xl p-4">
          <p className="font-normal">{summary.summaryText}</p>
          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Overall Attendance: <strong className="text-slate-800 font-bold">{summary.overallAttendance}%</strong></span>
            <span>·</span>
            <span>FN: <strong className="text-emerald-700">{summary.fnAttendance}%</strong></span>
            <span>·</span>
            <span>AN: <strong className="text-amber-700">{summary.anAttendance}%</strong></span>
            <span>·</span>
            <span>Current GPA: <strong className="text-indigo-700">{summary.overallGpa} / 10</strong></span>
          </div>
        </div>

        {/* 3 Pillars: Strengths, Concerns, Recommended */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Academic Strengths */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Academic Strengths</span>
            </div>
            <ul className="space-y-2">
              {summary.academicStrengths.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attendance Concern */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Attendance Concerns</span>
            </div>
            <ul className="space-y-2">
              {summary.attendanceConcerns.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Attention */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Recommended Action</span>
            </div>
            <ul className="space-y-2">
              {summary.recommendedAttention.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                  <span className="text-indigo-600 font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer timestamp */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Student ID: {summary.studentId}</span>
          <span>Last generated: {summary.lastGenerated}</span>
        </div>
      </div>
    </div>
  );
};
