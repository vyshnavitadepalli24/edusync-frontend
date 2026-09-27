import React, { useState } from 'react';
import { Sparkles, RefreshCw, BookOpen, TrendingUp, ShieldCheck } from 'lucide-react';
import { AIProgressSummary } from '../../components/ai/AIProgressSummary';
import { aiService } from '../../services/aiService';
import { AIParentSummary } from '../../types';
import { MOCK_PARENT_SUMMARY } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export const ParentProgress: React.FC = () => {
  const { addToast } = useToast();
  const [summary, setSummary] = useState<AIParentSummary>(MOCK_PARENT_SUMMARY);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const refreshed = await aiService.generateParentSummary('std_101', 'Rahul Kumar');
      setSummary(refreshed);
      addToast({
        type: 'ai',
        title: 'Cognitive Summary Synthesized',
        message: 'AI analyzed latest Forenoon & Afternoon roll-calls and Mid-Term scores.',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Cognitive Academic Digest
          </h1>
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            AI-Synthesized
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Natural-language contextual interpretation of attendance patterns, exam trajectories, and mentoring recommendations
        </p>
      </div>

      {/* AI Progress Summary Card Component */}
      <AIProgressSummary
        summary={summary}
        onRegenerate={handleRegenerate}
        isLoading={isRegenerating}
      />

      {/* Methodology Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          How EduNexus Synthesizes Guardian Summaries
        </h3>
        <p className="text-slate-600 leading-relaxed">
          The EduNexus cognitive engine applies deterministic statistical evaluation coupled with safety-bounded language models:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-800 block mb-1">1. Session Matrix Correlation</strong>
            <span className="text-slate-500">
              Evaluates Forenoon lecture attendance against Afternoon practical session attendance to detect unexcused departures.
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-800 block mb-1">2. Grade Variance Normalization</strong>
            <span className="text-slate-500">
              Highlights domain strengths (DBMS 91%, Java 89%) while flagging areas needing revision prior to semester finals.
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-800 block mb-1">3. Non-Punitive Recommendations</strong>
            <span className="text-slate-500">
              Focuses on positive guardian-faculty alignment rather than punitive measures to maintain student motivation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
