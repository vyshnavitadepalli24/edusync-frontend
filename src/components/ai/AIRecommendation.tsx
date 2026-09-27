import React from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

interface AIRecommendationProps {
  title: string;
  recommendation: string;
  category?: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionText?: string;
  onAction?: () => void;
}

export const AIRecommendation: React.FC<AIRecommendationProps> = ({
  title,
  recommendation,
  category = 'Attendance Optimization',
  impact = 'High',
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900">{title}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] text-slate-500">{category}</span>
              <span className="text-slate-300">·</span>
              <span className="text-[11px] font-semibold text-indigo-600">{impact} Impact</span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{recommendation}</p>
          </div>
        </div>

        {actionText && onAction && (
          <button
            onClick={onAction}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>{actionText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
