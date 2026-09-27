import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, Sparkles, Filter, Trash2 } from 'lucide-react';
import { useERPData } from '../../context/ERPDataContext';

export const ParentNotifications: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useERPData();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  const parentNotifs = notifications.filter((n) => {
    if (n.recipientRole !== 'parent') return false;
    if (filter === 'UNREAD' && n.read) return false;
    if (filter === 'READ' && !n.read) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Guardian Alerts & Notices</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional broadcasts, attendance warnings, and academic milestones
          </p>
        </div>

        <button
          onClick={clearAllNotifications}
          className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit text-xs font-semibold">
        {(['ALL', 'UNREAD', 'READ'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab === 'ALL' ? 'All Alerts' : tab === 'UNREAD' ? 'Unread Only' : 'Read'}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {parentNotifs.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
            No notifications matching this filter.
          </div>
        ) : (
          parentNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.actionUrl) onNavigate(n.actionUrl);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                !n.read
                  ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                    {n.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : n.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Bell className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">
                      {n.timestamp}
                    </span>
                  </div>
                </div>

                {n.actionUrl && (
                  <span className="text-xs font-semibold text-blue-600 hover:underline shrink-0">
                    View Details →
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
