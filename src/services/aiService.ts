import { AIAnomaly, AIParentSummary } from '../types';
import { INITIAL_ANOMALIES, MOCK_PARENT_SUMMARY } from '../data/mockData';

let anomaliesStore: AIAnomaly[] = [...INITIAL_ANOMALIES];

export const aiService = {
  async getAnomalies(filters?: { riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH'; isReviewed?: boolean }): Promise<AIAnomaly[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return anomaliesStore.filter((a) => {
      if (filters?.riskLevel && a.riskLevel !== filters.riskLevel) return false;
      if (filters?.isReviewed !== undefined && a.isReviewed !== filters.isReviewed) return false;
      return true;
    });
  },

  async markAnomalyReviewed(id: string, notes?: string): Promise<AIAnomaly> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const idx = anomaliesStore.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Anomaly not found');

    anomaliesStore[idx] = {
      ...anomaliesStore[idx],
      isReviewed: true,
      reviewedNotes: notes || 'Reviewed by Principal administration.',
    };

    return anomaliesStore[idx];
  },

  async generateParentSummary(studentId: string, studentName: string): Promise<AIParentSummary> {
    // Simulated AI generation latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    return {
      ...MOCK_PARENT_SUMMARY,
      studentId,
      studentName,
      lastGenerated: formattedDate,
    };
  },

  async analyzeApprovalRisk(requestType: string, reason: string): Promise<{
    confidence: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
    explanation: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const reasonLower = reason.toLowerCase();

    if (reasonLower.includes('hackathon') || reasonLower.includes('on-duty') || reasonLower.includes('re-totaling')) {
      return {
        confidence: 94,
        risk: 'LOW',
        explanation: 'Historical evidence and verified institutional duty certificate corroborate the change.',
      };
    }

    if (reasonLower.includes('medical') || reasonLower.includes('fever')) {
      return {
        confidence: 68,
        risk: 'MEDIUM',
        explanation: 'Medical documentation was submitted 48h past session window; verify physician stamp before signing.',
      };
    }

    return {
      confidence: 82,
      risk: 'LOW',
      explanation: `Proposed modification to ${requestType} aligns with expected class distribution.`,
    };
  },
};
