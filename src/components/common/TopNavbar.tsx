import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Search,
  Check,
  ChevronDown,
  UserCheck,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';
import { UserRole } from '../../types';

interface TopNavbarProps {
  onOpenMobile: () => void;
  onNavigate: (path: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobile, onNavigate }) => {
  const { user, role, switchRole, logout } = useAuth();
  const { notifications, unreadNotificationsCount, markNotificationAsRead, clearAllNotifications } = useERPData();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setIsRoleMenuOpen(false);
    if (newRole === 'principal') onNavigate('/principal/dashboard');
    else if (newRole === 'teacher') onNavigate('/teacher/dashboard');
    else onNavigate('/parent/dashboard');
  };

  return (
    <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile Hamburger + Workspace Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
            Academic ERP
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-xs font-semibold text-slate-800 truncate">
            {role === 'principal'
              ? 'Institutional Command'
              : role === 'teacher'
              ? 'Academic Faculty Workspace'
              : 'Guardian & Student Portal'}
          </span>
        </div>
      </div>

      {/* Zone 2: Fast Role Switcher (Crucial for Reviewer & Internship Demo) */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/60">
          <button
            onClick={() => handleRoleSwitch('principal')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              role === 'principal'
                ? 'bg-white text-blue-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Principal
          </button>
          <button
            onClick={() => handleRoleSwitch('teacher')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              role === 'teacher'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => handleRoleSwitch('parent')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              role === 'parent'
                ? 'bg-white text-purple-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parent
          </button>
        </div>
      </div>

      {/* Zone 3: Notification Bell & User Controls */}
      <div className="flex items-center gap-2">
        {/* Notification Bell Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">ERP Event Stream</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications in stream</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.actionUrl) {
                          onNavigate(notif.actionUrl);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 ${
                        !notif.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 leading-tight">{notif.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Role Profile Menu */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.name.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-none truncate max-w-[110px]">
                {user?.name.split(' ')[0]}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                {role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Switch Role Mode
              </div>

              <button
                onClick={() => handleRoleSwitch('principal')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Principal Dashboard</span>
                {role === 'principal' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleSwitch('teacher')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Teacher Dashboard</span>
                {role === 'teacher' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <button
                onClick={() => handleRoleSwitch('parent')}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>Parent Dashboard</span>
                {role === 'parent' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
