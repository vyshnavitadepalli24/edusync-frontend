import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  XCircle,
  Building2,
} from 'lucide-react';
import { KPICard } from '../../components/common/KPICard';
import { AIInsightCard } from '../../components/ai/AIInsightCard';
import { CampusAttendance3D } from '../../components/visualization/CampusAttendance3D';
import { AIRiskBadge, AIConfidenceBadge } from '../../components/common/Badges';
import { useERPData } from '../../context/ERPDataContext';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';
import { CorrectionRequest } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface PrincipalDashboardProps {
  onNavigate: (path: string) => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ onNavigate }) => {
  const { requests, anomalies, approveRequest, rejectRequest } = useERPData();

  const [show3D, setShow3D] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CorrectionRequest | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    request: CorrectionRequest;
  } | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingRequests = requests.filter((r) => r.status === 'Pending').slice(0, 3);
  const highSeverityAnomalies = anomalies.filter((a) => a.riskLevel === 'HIGH' || a.anomalyType === 'Session Skipping');

  // Chart datasets
  const classAttendanceComparison = [
    { class: 'CSE-A', fn: 93.8, an: 84.4, overall: 89.1 },
    { class: 'CSE-B', fn: 90.0, an: 86.7, overall: 88.3 },
    { class: 'ECE-A', fn: 96.4, an: 92.8, overall: 94.6 },
    { class: 'MECH-A', fn: 88.5, an: 80.0, overall: 84.2 },
  ];

  const weeklyTrend = [
    { day: 'Mon', attendance: 94.2, fn: 96.0, an: 92.4 },
    { day: 'Tue', attendance: 93.5, fn: 95.2, an: 91.8 },
    { day: 'Wed', attendance: 91.8, fn: 94.1, an: 89.5 },
    { day: 'Thu', attendance: 92.6, fn: 94.8, an: 90.4 },
    { day: 'Fri', attendance: 88.4, fn: 93.2, an: 83.6 }, // Noticeable Friday drop
    { day: 'Sat', attendance: 90.1, fn: 92.0, an: 88.2 },
  ];

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setIsProcessing(true);
    try {
      if (confirmAction.type === 'approve') {
        await approveRequest(confirmAction.request.id, reviewRemarks || 'Principal authorized.');
      } else {
        await rejectRequest(confirmAction.request.id, reviewRemarks || 'Principal declined.');
      }
      setConfirmAction(null);
      setSelectedRequest(null);
      setReviewRemarks('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Institutional Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-session attendance, AI safety scrutiny & department telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShow3D(!show3D)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
              show3D
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{show3D ? 'Hide 3D Campus' : 'Show 3D Campus'}</span>
          </button>

          <button
            onClick={() => onNavigate('/principal/attendance')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Open Attendance Matrix
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Total Students"
          value="125"
          subtext="Enrolled across 4 departments"
          icon={<Users className="w-4 h-4" />}
          accent="primary"
        />
        <KPICard
          label="Present Today"
          value="114"
          subtext="Forenoon (FN) aggregate"
          icon={<UserCheck className="w-4 h-4" />}
          trend={{ value: '91.2%', isPositive: true }}
          accent="success"
        />
        <KPICard
          label="Absent Today"
          value="11"
          subtext="Unexcused & session skips"
          icon={<UserX className="w-4 h-4" />}
          trend={{ value: '8.8%', isPositive: false }}
          accent="danger"
        />
        <KPICard
          label="Overall Attendance"
          value="89.8%"
          subtext="Target benchmark: ≥ 85%"
          icon={<TrendingUp className="w-4 h-4" />}
          trend={{ value: '+1.4% vs last week', isPositive: true }}
        />
        <KPICard
          label="Pending Requests"
          value={pendingRequests.length}
          subtext="Mark & attendance appeals"
          icon={<FileCheck2 className="w-4 h-4" />}
          accent="warning"
          onClick={() => onNavigate('/principal/requests')}
        />
      </div>

      {/* Prominent AI Insights Banner */}
      <AIInsightCard
        title="AI Insight: Session Skipping Spike Detected"
        anomalyCount={highSeverityAnomalies.length}
        message="8 students across CSE-A & MECH-A were marked Present in FN but Absent in AN session today."
        affectedClass="CSE-3A & ME-3A"
        date="Today, 2:45 PM"
        severity="MEDIUM"
        onViewDetails={() => onNavigate('/principal/anomalies')}
      />

      {/* Optional 3D Campus Heatmap */}
      {show3D && <CampusAttendance3D />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Attendance: FN vs AN Comparison */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Today's FN vs AN Attendance by Class
              </h3>
              <p className="text-[11px] text-slate-500">Noticeable 6–9% drop-off in Afternoon sessions</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Sep 27, 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classAttendanceComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="class" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="fn" name="Forenoon (FN) %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="an" name="Afternoon (AN) %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Weekly Attendance Trend (Institutional)
              </h3>
              <p className="text-[11px] text-slate-500">Consistent FN stability with Friday afternoon dip</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Week 39</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="fn" name="FN Attendance %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="an" name="AN Attendance %" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="attendance" name="Combined %" stroke="#6366f1" strokeWidth={2.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Column Section: Pending Approvals & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Pending Modification Requests
              </h3>
              <p className="text-[11px] text-slate-500">Requires Principal digital sign-off to overwrite finalized records</p>
            </div>
            <button
              onClick={() => onNavigate('/principal/requests')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({requests.filter((r) => r.status === 'Pending').length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No pending modification requests in queue.</div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-xl border border-slate-200/90 p-4 hover:border-slate-300 transition-colors bg-slate-50/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{req.studentName}</span>
                        <span className="text-xs font-mono text-slate-500">{req.studentRollNo}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-600">{req.className}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Initiated by <strong className="text-slate-700">{req.teacherName}</strong> for {req.subjectOrDate}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <AIConfidenceBadge confidence={req.aiConfidence} />
                      <AIRiskBadge risk={req.aiRiskLevel} />
                    </div>
                  </div>

                  <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white rounded-lg p-2.5 border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Original: </span>
                      <span className="font-mono text-slate-700">{req.originalValue}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Proposed: </span>
                      <span className="font-mono font-bold text-blue-700">{req.proposedValue}</span>
                    </div>
                    <div className="sm:col-span-2 text-slate-600 text-[11px] pt-1 border-t border-slate-50">
                      <strong>Reason: </strong> {req.reason}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full AI Safety Report</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setConfirmAction({ type: 'reject', request: req })}
                        className="px-3 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: 'approve', request: req })}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Stream (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Recent Institutional Activity</h3>
            <p className="text-[11px] text-slate-500">Live operational ledger logs</p>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Attendance Finalized (CSE-3A)</p>
                <p className="text-slate-500 text-[11px]">Prof. Anitha submitted today's FN/AN roll-call.</p>
                <span className="text-[10px] font-mono text-slate-400">Today, 1:15 PM</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Mark Appeal Submitted</p>
                <p className="text-slate-500 text-[11px]">Request #req_302 entered queue for Rahul Kumar.</p>
                <span className="text-[10px] font-mono text-slate-400">Today, 11:15 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">AI Anomaly Flagged</p>
                <p className="text-slate-500 text-[11px]">Rohan Verma flagged for 3 consecutive instructional absences.</p>
                <span className="text-[10px] font-mono text-slate-400">Today, 10:15 AM</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-semibold text-slate-900">Correction Approved</p>
                <p className="text-slate-500 text-[11px]">Principal signed off +8 marks for Vikramaditya Rao.</p>
                <span className="text-[10px] font-mono text-slate-400">Yesterday, 3:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full AI Safety Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="AI Safety Scrutiny Dossier"
          subtitle={`Request ID: #${selectedRequest.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Student:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedRequest.studentName}</div>
                <div className="text-slate-500 font-mono">{selectedRequest.studentRollNo} ({selectedRequest.className})</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Instructor:</span>
                <div className="font-bold text-slate-900 text-sm">{selectedRequest.teacherName}</div>
                <div className="text-slate-500">{selectedRequest.subjectOrDate}</div>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
                  AI Risk & Reliability Assessment
                </span>
                <div className="flex items-center gap-2">
                  <AIConfidenceBadge confidence={selectedRequest.aiConfidence} />
                  <AIRiskBadge risk={selectedRequest.aiRiskLevel} />
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">{selectedRequest.aiExplanation}</p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-semibold">Instructor Stated Justification:</span>
              <p className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 leading-relaxed">
                {selectedRequest.reason}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setConfirmAction({ type: 'reject', request: selectedRequest });
                }}
                className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  setConfirmAction({ type: 'approve', request: selectedRequest });
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Authorize & Approve
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Dialog before Approval / Rejection */}
      {confirmAction && (
        <ConfirmDialog
          isOpen={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirmAction}
          isLoading={isProcessing}
          variant={confirmAction.type === 'approve' ? 'success' : 'danger'}
          title={confirmAction.type === 'approve' ? 'Authorize Modification Request' : 'Reject Modification Request'}
          message={`Are you sure you want to ${confirmAction.type} the request for ${confirmAction.request.studentName} (${confirmAction.request.subjectOrDate})? This will immediately synchronize across Teacher and Parent portals.`}
          confirmText={confirmAction.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
        />
      )}
    </div>
  );
};
