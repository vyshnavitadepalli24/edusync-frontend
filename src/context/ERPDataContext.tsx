import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CorrectionRequest, AIAnomaly, NotificationItem } from '../types';
import { requestService } from '../services/requestService';
import { aiService } from '../services/aiService';
import { notificationService } from '../services/notificationService';
import { useToast } from './ToastContext';

interface ERPDataContextType {
  pendingRequestsCount: number;
  unreviewedAnomaliesCount: number;
  unreadNotificationsCount: number;
  notifications: NotificationItem[];
  requests: CorrectionRequest[];
  anomalies: AIAnomaly[];
  refreshData: () => Promise<void>;
  approveRequest: (requestId: string, remarks?: string) => Promise<void>;
  rejectRequest: (requestId: string, remarks?: string) => Promise<void>;
  markAnomalyReviewed: (anomalyId: string, notes?: string) => Promise<void>;
  submitCorrectionRequest: (data: Parameters<typeof requestService.createRequest>[0]) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const ERPDataContext = createContext<ERPDataContextType | undefined>(undefined);

export const ERPDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<CorrectionRequest[]>([]);
  const [anomalies, setAnomalies] = useState<AIAnomaly[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { addToast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [reqs, anoms, notifs] = await Promise.all([
        requestService.getRequests(),
        aiService.getAnomalies(),
        notificationService.getNotifications(),
      ]);
      setRequests(reqs);
      setAnomalies(anoms);
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load ERP data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsub = notificationService.subscribe((updatedNotifs) => {
      setNotifications(updatedNotifs);
    });
    return unsub;
  }, [loadData]);

  const approveRequest = async (requestId: string, remarks?: string) => {
    const updated = await requestService.updateRequestStatus(requestId, 'Approved', 'Dr. Ramesh Sundaram', remarks);
    setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));

    // Fire notifications to Teacher & Parent
    await notificationService.sendNotification({
      recipientRole: 'teacher',
      title: 'Correction Request Approved',
      message: `Principal approved the correction for ${updated.studentName} (${updated.subjectOrDate}).`,
      type: 'success',
      actionUrl: '/teacher/requests',
    });

    addToast({
      type: 'success',
      title: 'Request Approved',
      message: `Correction for ${updated.studentName} has been authorized and committed to master ledger.`,
    });
  };

  const rejectRequest = async (requestId: string, remarks?: string) => {
    const updated = await requestService.updateRequestStatus(requestId, 'Rejected', 'Dr. Ramesh Sundaram', remarks);
    setRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));

    await notificationService.sendNotification({
      recipientRole: 'teacher',
      title: 'Correction Request Rejected',
      message: `Principal rejected the correction for ${updated.studentName}: ${remarks || 'Per institutional policy'}`,
      type: 'error',
      actionUrl: '/teacher/requests',
    });

    addToast({
      type: 'info',
      title: 'Request Rejected',
      message: `Request for ${updated.studentName} marked as rejected. Teacher has been notified.`,
    });
  };

  const markAnomalyReviewed = async (anomalyId: string, notes?: string) => {
    const updated = await aiService.markAnomalyReviewed(anomalyId, notes);
    setAnomalies((prev) => prev.map((a) => (a.id === anomalyId ? updated : a)));

    addToast({
      type: 'success',
      title: 'Anomaly Marked Reviewed',
      message: `Audit notes recorded for ${updated.studentName}.`,
    });
  };

  const submitCorrectionRequest = async (data: Parameters<typeof requestService.createRequest>[0]) => {
    const created = await requestService.createRequest(data);
    setRequests((prev) => [created, ...prev]);

    // Notify Principal
    await notificationService.sendNotification({
      recipientRole: 'principal',
      title: 'New Modification Request',
      message: `${created.teacherName} submitted a correction for ${created.studentName} (${created.recordType.replace('_', ' ').toUpperCase()}).`,
      type: 'info',
      actionUrl: '/principal/requests',
    });

    addToast({
      type: 'success',
      title: 'Request Submitted to Principal',
      message: `Correction request #${created.id} is queued for administrative approval.`,
    });
  };

  const markNotificationAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      message: 'All alerts marked as read.',
    });
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;
  const unreviewedAnomaliesCount = anomalies.filter((a) => !a.isReviewed).length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <ERPDataContext.Provider
      value={{
        pendingRequestsCount,
        unreviewedAnomaliesCount,
        unreadNotificationsCount,
        notifications,
        requests,
        anomalies,
        refreshData: loadData,
        approveRequest,
        rejectRequest,
        markAnomalyReviewed,
        submitCorrectionRequest,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </ERPDataContext.Provider>
  );
};

export const useERPData = () => {
  const context = useContext(ERPDataContext);
  if (!context) {
    throw new Error('useERPData must be used within an ERPDataProvider');
  }
  return context;
};
