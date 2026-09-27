import React, { useState } from 'react';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useERPData } from '../../context/ERPDataContext';
import { StatusBadge, AIConfidenceBadge, AIRiskBadge } from '../../components/common/Badges';
import { Modal } from '../../components/common/Modal';
import { CorrectionRecordType } from '../../types';

export const TeacherRequests: React.FC = () => {
  const { requests, submitCorrectionRequest } = useERPData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('Rahul Kumar');
  const [studentRollNo, setStudentRollNo] = useState('21CS001');
  const [studentId, setStudentId] = useState('std_101');
  const [recordType, setRecordType] = useState<CorrectionRecordType>('attendance_an');
  const [subjectOrDate, setSubjectOrDate] = useState('2026-09-27 (AN Lab Session)');
  const [originalValue, setOriginalValue] = useState('Absent');
  const [proposedValue, setProposedValue] = useState('Present (Duty Slip)');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter requests initiated by this teacher (Prof. Anitha)
  const teacherRequests = requests.filter((r) => r.teacherName.includes('Anitha'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await submitCorrectionRequest({
        teacherId: 'usr_t1',
        teacherName: 'Prof. Anitha Vasudevan',
        studentId,
        studentName,
        studentRollNo,
        className: 'CSE - 3rd Year (Sec A)',
        subjectOrDate,
        recordType,
        originalValue,
        proposedValue,
        reason,
      });

      setIsModalOpen(false);
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelect = (val: string) => {
    if (val === '21CS001') {
      setStudentName('Rahul Kumar');
      setStudentRollNo('21CS001');
      setStudentId('std_101');
    } else if (val === '21CS004') {
      setStudentName('Priya Nair');
      setStudentRollNo('21CS004');
      setStudentId('std_104');
    } else if (val === '21CS005') {
      setStudentName('Rohan Verma');
      setStudentRollNo('21CS005');
      setStudentId('std_105');
    } else {
      setStudentName('Aarav Sharma');
      setStudentRollNo('21CS002');
      setStudentId('std_102');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Modification Request Workflows
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Faculty cannot alter locked records directly. Submit official appeals to the Principal with justification.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Request Record Correction</span>
        </button>
      </div>

      {/* Policy Warning Banner */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Institutional Tamper-Proof Policy:</strong> Finalized Forenoon/Afternoon attendance and exam marks are cryptographically anchored. Any retroactive adjustment requires digital sign-off from Dr. Ramesh Sundaram (Principal).
        </div>
      </div>

      {/* Requests History List */}
      <div className="space-y-4">
        {teacherRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-sm text-slate-900">{req.studentName}</span>
                <span className="text-xs font-mono text-slate-500">{req.studentRollNo}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-600">{req.subjectOrDate}</span>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={req.status} />
                <AIConfidenceBadge confidence={req.aiConfidence} />
                <AIRiskBadge risk={req.aiRiskLevel} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Locked Value: </span>
                <span className="font-mono text-slate-700 line-through">{req.originalValue}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Requested Value: </span>
                <span className="font-mono font-bold text-blue-700">{req.proposedValue}</span>
              </div>
              <div className="sm:col-span-2 text-slate-600 pt-1 border-t border-slate-200/50">
                <strong>Justification: </strong> {req.reason}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
              <span>Submitted on {req.submittedDate}</span>
              {req.reviewedBy && (
                <span className="text-slate-600 font-semibold">
                  Status: {req.status} by {req.reviewedBy}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Correction Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Submit Record Correction Request"
          subtitle="This request will enter the Principal's approval queue with AI safety scoring"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Select Candidate Student</label>
              <select
                value={studentRollNo}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-semibold"
              >
                <option value="21CS001">Rahul Kumar (21CS001) - CSE 3A</option>
                <option value="21CS004">Priya Nair (21CS004) - CSE 3A</option>
                <option value="21CS005">Rohan Verma (21CS005) - CSE 3A</option>
                <option value="21CS002">Aarav Sharma (21CS002) - CSE 3A</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Record Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                >
                  <option value="attendance_an">Afternoon (AN) Attendance</option>
                  <option value="attendance_fn">Forenoon (FN) Attendance</option>
                  <option value="exam_marks">Examination Marks</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Subject / Session Date</label>
                <input
                  type="text"
                  value={subjectOrDate}
                  onChange={(e) => setSubjectOrDate(e.target.value)}
                  placeholder="e.g. 2026-09-27 (AN Lab)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Current Finalized Value</label>
                <input
                  type="text"
                  required
                  value={originalValue}
                  onChange={(e) => setOriginalValue(e.target.value)}
                  placeholder="e.g. Absent or 78 / 100"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proposed Target Value</label>
                <input
                  type="text"
                  required
                  value={proposedValue}
                  onChange={(e) => setProposedValue(e.target.value)}
                  placeholder="e.g. Present (On-Duty) or 84 / 100"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-hidden font-mono font-bold text-blue-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                Detailed Academic Justification <span className="text-slate-400 font-normal">(Scrutinized by AI Safety)</span>
              </label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide objective facts (e.g., student attended hackathon on-duty with HOD certificate; optical re-scrutiny of question 4b)..."
                rows={3}
                className="w-full p-2.5 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Transmitting to Principal...' : 'Submit to Principal for Approval'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
