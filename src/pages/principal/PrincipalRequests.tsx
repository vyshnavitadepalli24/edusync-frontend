import React, { useState } from 'react';
import {
  FileCheck2,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useERPData } from '../../context/ERPDataContext';
import { CorrectionRequest } from '../../types';
import { AIConfidenceBadge, AIRiskBadge, StatusBadge } from '../../components/common/Badges';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { SearchBar } from '../../components/common/SearchBar';

export const PrincipalRequests: React.FC<{ onNavigate: (path: string) => void }> = () => {
  const { requests, approveRequest, rejectRequest } = useERPData();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetail, setSelectedDetail] = useState<CorrectionRequest | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'approve' | 'reject';
    request: CorrectionRequest;
  } | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredRequests = requests.filter((req) => {
    if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = req.studentName.toLowerCase().includes(q);
      const matchTeacher = req.teacherName.toLowerCase().includes(q);
      const matchRoll = req.studentRollNo.toLowerCase().includes(q);
      if (!matchName && !matchTeacher && !matchRoll) return false;
    }
    return true;
  });

  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    setIsProcessing(true);
    try {
      if (confirmDialog.type === 'approve') {
        await approveRequest(confirmDialog.request.id, reviewNote || 'Approved by Principal.');
      } else {
        await rejectRequest(confirmDialog.request.id, reviewNote || 'Rejected per institutional criteria.');
      }
      setConfirmDialog(null);
      setSelectedDetail(null);
      setReviewNote('');
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Modification Approval Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize or reject faculty requests to modify finalized attendance or examination marks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-semibold">
            {pendingCount} Pending Approvals
          </span>
        </div>
      </div>

      {/* Stats Counter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-amber-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-600">Pending Review</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{pendingCount}</div>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="bg-white rounded-xl border border-emerald-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Approved & Locked</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{approvedCount}</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>

        <div className="bg-white rounded-xl border border-rose-200 p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">Rejected</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">{rejectedCount}</div>
          </div>
          <XCircle className="w-6 h-6 text-rose-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-semibold">
          {(['ALL', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {s === 'ALL' ? 'All Requests' : s}
            </button>
          ))}
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by student, teacher or roll..."
          className="w-full sm:w-72"
        />
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
            No modification requests match the current status filter.
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPending = req.status === 'Pending';
            const isExam = req.recordType === 'exam_marks';

            return (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 hover:border-slate-300 transition-colors shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{req.studentName}</span>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">({req.studentRollNo})</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-600 font-medium">{req.className}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {isExam ? 'Exam Marks' : 'Session Attendance'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <AIConfidenceBadge confidence={req.aiConfidence} />
                    <AIRiskBadge risk={req.aiRiskLevel} />
                  </div>
                </div>

                {/* Values comparison block */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Subject / Session Date
                    </span>
                    <div className="font-semibold text-slate-800 mt-0.5">{req.subjectOrDate}</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Faculty: <strong className="text-slate-700">{req.teacherName}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Current (Finalized) Value
                    </span>
                    <div className="font-mono font-medium text-slate-600 line-through mt-0.5">
                      {req.originalValue}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Proposed (Target) Value
                    </span>
                    <div className="font-mono font-bold text-emerald-700 mt-0.5">
                      {req.proposedValue}
                    </div>
                  </div>
                </div>

                {/* Stated Reason & AI Assessment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/60 space-y-1">
                    <span className="font-semibold text-slate-700">Faculty Stated Reason:</span>
                    <p className="text-slate-600 leading-relaxed">{req.reason}</p>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
                        AI Safety Assessment
                      </span>
                      <span className="text-[10px] font-mono text-indigo-700 font-semibold">
                        Confidence: {req.aiConfidence}% · Risk: {req.aiRiskLevel}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">{req.aiExplanation}</p>
                  </div>
                </div>

                {/* Footer and action bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted on {req.submittedDate}</span>
                    {req.reviewedBy && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span>Reviewed by {req.reviewedBy}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetail(req)}
                      className="px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      View Full Details
                    </button>

                    {isPending && (
                      <>
                        <button
                          onClick={() => setConfirmDialog({ type: 'reject', request: req })}
                          className="px-3.5 py-1.5 font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => setConfirmDialog({ type: 'approve', request: req })}
                          className="px-4 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Approve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Modal */}
      {selectedDetail && (
        <Modal
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          title="Modification Request Dossier"
          subtitle={`Request #${selectedDetail.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 font-medium text-[10px] uppercase">Student</span>
                <div className="font-bold text-slate-900">{selectedDetail.studentName}</div>
                <div className="text-slate-500 font-mono">{selectedDetail.studentRollNo}</div>
              </div>
              <div>
                <span className="text-slate-400 font-medium text-[10px] uppercase">Faculty</span>
                <div className="font-bold text-slate-900">{selectedDetail.teacherName}</div>
                <div className="text-slate-500">{selectedDetail.className}</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg space-y-1">
              <div className="font-bold text-indigo-950 uppercase text-[11px]">AI Behavioral Analysis</div>
              <p className="text-slate-700">{selectedDetail.aiExplanation}</p>
            </div>

            <div>
              <span className="font-semibold text-slate-700">Detailed Justification</span>
              <p className="p-3 bg-slate-50 border rounded-lg text-slate-700 mt-1">{selectedDetail.reason}</p>
            </div>

            {selectedDetail.status === 'Pending' && (
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setConfirmDialog({ type: 'reject', request: selectedDetail })}
                  className="px-3.5 py-1.5 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg font-semibold"
                >
                  Reject
                </button>
                <button
                  onClick={() => setConfirmDialog({ type: 'approve', request: selectedDetail })}
                  className="px-4 py-1.5 text-white bg-emerald-600 rounded-lg font-semibold"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={!!confirmDialog}
          onClose={() => setConfirmDialog(null)}
          onConfirm={handleConfirmAction}
          isLoading={isProcessing}
          variant={confirmDialog.type === 'approve' ? 'success' : 'danger'}
          title={confirmDialog.type === 'approve' ? 'Approve Modification Request' : 'Reject Modification Request'}
          message={`Are you certain you wish to ${confirmDialog.type} the change for ${confirmDialog.request.studentName}? This modification will update central master records.`}
          confirmText={confirmDialog.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        />
      )}
    </div>
  );
};
