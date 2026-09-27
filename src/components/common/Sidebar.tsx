import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  Users,
  UserSquare2,
  FileCheck2,
  Sparkles,
  BarChart3,
  Settings,
  BookOpen,
  Award,
  Bell,
  User,
  LogOut,
  X,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useERPData } from '../../context/ERPDataContext';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { user, role, logout } = useAuth();
  const { pendingRequestsCount, unreviewedAnomaliesCount, unreadNotificationsCount } = useERPData();

  interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    badgeCount?: number;
    badgeVariant?: 'danger' | 'warning' | 'ai' | 'info';
  }

  const principalItems: NavItem[] = [
    { label: 'Dashboard', path: '/principal/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Attendance Monitoring', path: '/principal/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    {
      label: 'AI Attendance Anomalies',
      path: '/principal/anomalies',
      icon: <Sparkles className="w-4 h-4" />,
      badgeCount: unreviewedAnomaliesCount,
      badgeVariant: 'ai',
    },
    {
      label: 'Approval Requests',
      path: '/principal/requests',
      icon: <FileCheck2 className="w-4 h-4" />,
      badgeCount: pendingRequestsCount,
      badgeVariant: 'warning',
    },
    { label: 'Student Directory', path: '/principal/students', icon: <GraduationCap className="w-4 h-4" /> },
    { label: 'Faculty Directory', path: '/principal/teachers', icon: <Users className="w-4 h-4" /> },
    { label: 'Parent Directory', path: '/principal/parents', icon: <UserSquare2 className="w-4 h-4" /> },
    { label: 'Academic Analytics', path: '/principal/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'System Settings', path: '/principal/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const teacherItems: NavItem[] = [
    { label: 'Teacher Dashboard', path: '/teacher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Assigned Classes', path: '/teacher/classes', icon: <Layers className="w-4 h-4" /> },
    { label: 'Daily Attendance Engine', path: '/teacher/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'Examination Marks', path: '/teacher/marks', icon: <Award className="w-4 h-4" /> },
    { label: 'Correction Requests', path: '/teacher/requests', icon: <FileCheck2 className="w-4 h-4" /> },
    { label: 'Class Analytics', path: '/teacher/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const parentItems: NavItem[] = [
    { label: 'Student Overview', path: '/parent/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Attendance Calendar', path: '/parent/attendance', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: 'Report Card & Marks', path: '/parent/marks', icon: <Award className="w-4 h-4" /> },
    { label: 'AI Progress Summary', path: '/parent/progress', icon: <Sparkles className="w-4 h-4" /> },
    {
      label: 'Alerts & Messages',
      path: '/parent/notifications',
      icon: <Bell className="w-4 h-4" />,
      badgeCount: unreadNotificationsCount,
      badgeVariant: 'danger',
    },
    { label: 'Student Profile', path: '/parent/profile', icon: <User className="w-4 h-4" /> },
  ];

  const navItems = role === 'principal' ? principalItems : role === 'teacher' ? teacherItems : parentItems;

  const roleLabel =
    role === 'principal' ? 'Principal & Director' : role === 'teacher' ? 'Faculty Portal' : 'Parent Portal';

  const roleBadgeColor =
    role === 'principal'
      ? 'bg-blue-50 text-blue-800 border-blue-200'
      : role === 'teacher'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : 'bg-purple-50 text-purple-800 border-purple-200';

  const handleNavClick = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 text-slate-700 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-xs">
            <span className="text-base tracking-tighter">EN</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900">EduNexus</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Smart Academic Architecture</p>
          </div>
        </div>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Access Scope</div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${roleBadgeColor}`}>
          {roleLabel}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full tabular-nums ${
                    item.badgeVariant === 'ai'
                      ? 'bg-indigo-100 text-indigo-700'
                      : item.badgeVariant === 'warning'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User Snapshot & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
              {user?.name.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
              <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors shrink-0 cursor-pointer"
            title="Sign out of EduNexus"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
