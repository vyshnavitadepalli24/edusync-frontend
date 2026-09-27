import React, { useState } from 'react';
import {
  Settings,
  Save,
  Clock,
  ShieldAlert,
  Sparkles,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PrincipalSettings: React.FC = () => {
  const { addToast } = useToast();

  const [fnStartTime, setFnStartTime] = useState('08:45');
  const [fnCutoffTime, setFnCutoffTime] = useState('09:15');
  const [anStartTime, setAnStartTime] = useState('13:30');
  const [anCutoffTime, setAnCutoffTime] = useState('13:45');
  const [threshold, setThreshold] = useState('75');
  const [aiSensitivity, setAiSensitivity] = useState<'Standard' | 'Strict' | 'Lenient'>('Standard');
  const [autoFlagSessionSkips, setAutoFlagSessionSkips] = useState(true);
  const [smsParentAlerts, setSmsParentAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Institutional Settings Saved',
      message: 'FN/AN cutoff parameters and AI anomaly thresholds updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">ERP System Configuration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Institutional rules, session cutoff schedules, AI anomaly tuning and backend connection hooks
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Session Cutoff Times */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Forenoon (FN) & Afternoon (AN) Session Timings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800">Forenoon (FN) Schedule</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Roll-Call Start</label>
                  <input
                    type="time"
                    value={fnStartTime}
                    onChange={(e) => setFnStartTime(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Late Cutoff</label>
                  <input
                    type="time"
                    value={fnCutoffTime}
                    onChange={(e) => setFnCutoffTime(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800">Afternoon (AN) Schedule</span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="text-slate-500 text-[11px]">Session Resumption</label>
                  <input
                    type="time"
                    value={anStartTime}
                    onChange={(e) => setAnStartTime(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-500 text-[11px]">Lab Gate Lock</label>
                  <input
                    type="time"
                    value={anCutoffTime}
                    onChange={(e) => setAnCutoffTime(e.target.value)}
                    className="w-full mt-1 p-2 bg-white border border-slate-200 rounded font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Anomaly Rules */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              AI Anomaly Engine Sensitivity
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Statutory Attendance Threshold (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    min="50"
                    max="90"
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                  />
                  <span className="text-slate-500 text-[11px]">
                    Automatic warning fired when overall drops below this mark.
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  AI Risk Classifier Tuning
                </label>
                <select
                  value={aiSensitivity}
                  onChange={(e) => setAiSensitivity(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-semibold text-slate-800"
                >
                  <option value="Strict">Strict (Flags single session skips immediately)</option>
                  <option value="Standard">Standard (Flags patterns & streak skips)</option>
                  <option value="Lenient">Lenient (Requires ≥ 3 session skips)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoFlagSessionSkips}
                  onChange={(e) => setAutoFlagSessionSkips(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Automatically classify Forenoon Present + Afternoon Absent as "Session Skipping"</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsParentAlerts}
                  onChange={(e) => setSmsParentAlerts(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Dispatch automated Guardian alert upon second unexcused session skip</span>
              </label>
            </div>
          </div>
        </div>

        {/* Backend / Cloud Database Layer Info */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Team 3: AI-ERP Beta Integration Specification
            </h3>
          </div>

          <p className="text-slate-600 leading-relaxed">
            EduNexus frontend is organized with pristine decoupled service layers:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-slate-700">
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <code>src/services/attendanceService.ts</code> → Supabase RPC
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <code>src/services/requestService.ts</code> → Express REST / Webhooks
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <code>src/services/aiService.ts</code> → Gemini / Groq Orchestrator
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-100">
              <code>src/services/notificationService.ts</code> → Supabase Realtime
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Institutional Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
