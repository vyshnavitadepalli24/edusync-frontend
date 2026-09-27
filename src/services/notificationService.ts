import { NotificationItem, UserRole } from '../types';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

let notificationsStore: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

type NotificationListener = (notifications: NotificationItem[]) => void;
const listeners: Set<NotificationListener> = new Set();

const notifyListeners = () => {
  listeners.forEach((l) => l([...notificationsStore]));
};

export const notificationService = {
  async getNotifications(role?: UserRole): Promise<NotificationItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!role) return [...notificationsStore];
    return notificationsStore.filter((n) => n.recipientRole === role);
  },

  async markAsRead(id: string): Promise<void> {
    const item = notificationsStore.find((n) => n.id === id);
    if (item) {
      item.read = true;
      notifyListeners();
    }
  },

  async markAllAsRead(role?: UserRole): Promise<void> {
    notificationsStore = notificationsStore.map((n) => {
      if (!role || n.recipientRole === role) {
        return { ...n, read: true };
      }
      return n;
    });
    notifyListeners();
  },

  async sendNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<NotificationItem> {
    const newItem: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    notificationsStore.unshift(newItem);
    notifyListeners();
    return newItem;
  },

  subscribe(listener: NotificationListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
