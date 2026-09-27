import React, { useState } from 'react';
import { Sparkles, Filter, CheckCircle2, ShieldAlert, AlertTriangle, RefreshCw } from 'lucide-react';
import { useERPData } from '../../context/ERPDataContext';
import { AnomalyAlert } from '../../components/ai/AnomalyAlert';
import { Modal } from '../../components/common/Modal';
import { SearchBar } from '../../components/common/SearchBar';

export const PrincipalAnomalies: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { anomalies, markAnomalyReviewed } = useERPData();

  const [riskFilter, setRiskFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [reviewFilter, setReviewFilter] = useState<'ALL' | 'UNREVIEWED' | 'REVIEWED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAnomalies = anomalies.filter((item) => {
    if (riskFilter !== 'ALL' && item.riskLevel !== riskFilter) return false;
    if (reviewFilter === 'UNREVIEWED' && item.isReviewed) return false;
    if (reviewFilter === 'REVIEWED' && !item.isReviewed) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.studentName.toLowerCase().includes(q);
      const matchRoll = item.studentRollNo.toLowerCase().includes(q);
      const matchType = item.anomalyType.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchType) return false;
    }
    return true;
  });

  const handleReviewSubmit = async () => {
    if (!activeReviewId) return;
    setIsSubmitting(true);
    try {
      await markAnomalyReviewed(activeReviewId, reviewNotes || 'Reviewed and documented by Principal.');
      setActiveReviewId(null);
      setReviewNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const highCount = anomalies.filter((a) => a.riskLevel === 'HIGH' && !a.isReviewed).length;
  const mediumCount = anomalies.filter((a) => a.riskLevel === 'MEDIUM' && !a.isReviewed).length;
  const sessionSkipCount = anomalies.filter((a) => a.anomalyType === 'Session Skipping').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">AI Attendance Anomalies</h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Cognitive Detector
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            The AI engine continuously correlates morning roll-call with afternoon lab logs to flag session skipping and sudden drop-offs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/principal/attendance')}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          View Attendance Matrix
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-rose-200 p-4">
          <div className="flex items-center justify-between text-rose-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">High Risk Anomaly</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{highCount}</div>
          <p className="text-xs text-slate-500 mt-0.5">Streak absences & below 75% statutory quota</p>
        </div>

        <div className="bg-white rounded-xl border border-amber-200 p-4">
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Session Skips (FN vs AN)</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{sessionSkipCount}</div>
          <p className="text-xs text-slate-500 mt-0.5">Present in Forenoon, unregistered in Afternoon</p>
        </div>

        <div className="bg-white rounded-xl border border-indigo-200 p-4">
          <div className="flex items-center justify-between text-indigo-600 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Unreviewed Alerts</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {anomalies.filter((a) => !a.isReviewed).length}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Awaiting administrative clearance</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Risk Level Segmented Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-semibold">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                riskFilter === level
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {level === 'ALL' ? 'All Risks' : `${level.charAt(0) + level.slice(1).toLowerCase()} Risk`}
            </button>
          ))}
        </div>

        {/* Reviewed Status Selector & Search */}
        <div className="flex items-center gap-2">
          <select
            value={reviewFilter}
            onChange={(e) => setReviewFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNREVIEWED">Unreviewed Only</option>
            <option value="REVIEWED">Reviewed Only</option>
          </select>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search anomalies..."
            className="w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Anomaly Stream Cards */}
      <div className="space-y-3">
        {filteredAnomalies.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
            No attendance anomalies found matching filter criteria.
          </div>
        ) : (
          filteredAnomalies.map((item) => (
            <AnomalyAlert
              key={item.id}
              anomaly={item}
              onReview={(id) => setActiveReviewId(id)}
              onViewStudent={() => onNavigate('/principal/students')}
              onViewAttendance={() => onNavigate('/principal/attendance')}
            />
          ))
        )}
      </div>

      {/* Review Notes Modal */}
      {activeReviewId && (
        <Modal
          isOpen={!!activeReviewId}
          onClose={() => setActiveReviewId(null)}
          title="Document Anomaly Review"
          subtitle="Record Principal administrative audit notes"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Logging a review notes that this anomaly pattern has been investigated with the respective class teacher or student's guardian.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Administrative Notes / Action Taken:</label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Verified medical certificate with HOD; parent was informed via SMS."
                rows={3}
                className="w-full p-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveReviewId(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Mark as Reviewed'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
