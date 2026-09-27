import { CorrectionRequest } from '../types';
import { INITIAL_REQUESTS } from '../data/mockData';

let requestsStore: CorrectionRequest[] = [...INITIAL_REQUESTS];

export const requestService = {
  async getRequests(filters?: { status?: 'Pending' | 'Approved' | 'Rejected'; teacherId?: string }): Promise<CorrectionRequest[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return requestsStore.filter((r) => {
      if (filters?.status && r.status !== filters.status) return false;
      if (filters?.teacherId && r.teacherId !== filters.teacherId) return false;
      return true;
    });
  },

  async createRequest(
    data: Omit<CorrectionRequest, 'id' | 'submittedDate' | 'status' | 'aiConfidence' | 'aiRiskLevel' | 'aiExplanation'>
  ): Promise<CorrectionRequest> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Simulated AI Safety Assessment calculation
    const hasStrongReason = data.reason.length > 30;
    const isExamMarks = data.recordType === 'exam_marks';

    const confidence = hasStrongReason ? 91 + Math.floor(Math.random() * 6) : 65 + Math.floor(Math.random() * 20);
    const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = confidence > 85 ? 'LOW' : confidence > 70 ? 'MEDIUM' : 'HIGH';

    const aiExplanation = isExamMarks
      ? `AI Scrutiny: Proposed mark change (${data.originalValue} -> ${data.proposedValue}) aligns within standard recalculation variance (+/- 10%) and historical trajectory.`
      : `AI Scrutiny: Attendance shift request is substantiated with justification. Risk level determined as ${riskLevel}.`;

    const newRequest: CorrectionRequest = {
      ...data,
      id: `req_${Date.now()}`,
      submittedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending',
      aiConfidence: confidence,
      aiRiskLevel: riskLevel,
      aiExplanation,
    };

    requestsStore.unshift(newRequest);
    return newRequest;
  },

  async updateRequestStatus(
    id: string,
    status: 'Approved' | 'Rejected',
    reviewedBy: string,
    remarks?: string
  ): Promise<CorrectionRequest> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const idx = requestsStore.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Request not found');

    requestsStore[idx] = {
      ...requestsStore[idx],
      status,
      reviewedBy,
      reviewedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewRemarks: remarks || (status === 'Approved' ? 'Principal approved after verification.' : 'Rejected per academic policy.'),
    };

    return requestsStore[idx];
  },
};
