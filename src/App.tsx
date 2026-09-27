import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ERPDataProvider } from './context/ERPDataContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { UserRole } from './types';

// Principal Pages
import { PrincipalDashboard } from './pages/principal/PrincipalDashboard';
import { PrincipalAttendance } from './pages/principal/PrincipalAttendance';
import { PrincipalAnomalies } from './pages/principal/PrincipalAnomalies';
import { PrincipalRequests } from './pages/principal/PrincipalRequests';
import { PrincipalStudents } from './pages/principal/PrincipalStudents';
import { PrincipalTeachers } from './pages/principal/PrincipalTeachers';
import { PrincipalParents } from './pages/principal/PrincipalParents';
import { PrincipalAnalytics } from './pages/principal/PrincipalAnalytics';
import { PrincipalSettings } from './pages/principal/PrincipalSettings';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherClasses } from './pages/teacher/TeacherClasses';
import { TeacherAttendance } from './pages/teacher/TeacherAttendance';
import { TeacherMarks } from './pages/teacher/TeacherMarks';
import { TeacherRequests } from './pages/teacher/TeacherRequests';
import { TeacherAnalytics } from './pages/teacher/TeacherAnalytics';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentAttendance } from './pages/parent/ParentAttendance';
import { ParentMarks } from './pages/parent/ParentMarks';
import { ParentProgress } from './pages/parent/ParentProgress';
import { ParentNotifications } from './pages/parent/ParentNotifications';
import { ParentProfile } from './pages/parent/ParentProfile';

const AppContent: React.FC = () => {
  const { user, role, isAuthenticated, switchRole } = useAuth();

  // Normalize initial path from window.location.pathname or hash
  const getInitialPath = () => {
    const p = window.location.pathname;
    if (p && p !== '/' && p !== '/index.html') {
      return p;
    }
    const h = window.location.hash.replace('#', '');
    if (h) return h;
    return role === 'principal'
      ? '/principal/dashboard'
      : role === 'teacher'
      ? '/teacher/dashboard'
      : '/parent/dashboard';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p && p !== '/' && p !== '/index.html') {
        setCurrentPath(p);
      } else {
        const h = window.location.hash.replace('#', '');
        if (h) setCurrentPath(h);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto sync active role if user navigated across role boundaries
    if (path.startsWith('/principal') && role !== 'principal') {
      switchRole('principal');
    } else if (path.startsWith('/teacher') && role !== 'teacher') {
      switchRole('teacher');
    } else if (path.startsWith('/parent') && role !== 'parent') {
      switchRole('parent');
    }
  };

  // If user explicitly requests /login or not authenticated
  if (!isAuthenticated || currentPath === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(newRole) => {
          if (newRole === 'principal') navigateTo('/principal/dashboard');
          else if (newRole === 'teacher') navigateTo('/teacher/dashboard');
          else navigateTo('/parent/dashboard');
        }}
      />
    );
  }

  // Derive breadcrumbs based on current path
  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length === 0) return [];

    const rolePart = parts[0];
    const sectionPart = parts[1] || 'dashboard';

    const roleLabel =
      rolePart === 'principal' ? 'Principal' : rolePart === 'teacher' ? 'Teacher' : 'Parent';

    const formatSection = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');

    return [
      {
        label: roleLabel,
        onClick: () => navigateTo(`/${rolePart}/dashboard`),
      },
      {
        label: formatSection(sectionPart),
      },
    ];
  };

  // Render view corresponding to route
  const renderCurrentRoute = () => {
    switch (currentPath) {
      // Principal Routes
      case '/principal/dashboard':
      case '/principal':
        return <PrincipalDashboard onNavigate={navigateTo} />;
      case '/principal/attendance':
        return <PrincipalAttendance onNavigate={navigateTo} />;
      case '/principal/anomalies':
        return <PrincipalAnomalies onNavigate={navigateTo} />;
      case '/principal/requests':
        return <PrincipalRequests onNavigate={navigateTo} />;
      case '/principal/students':
        return <PrincipalStudents onNavigate={navigateTo} />;
      case '/principal/teachers':
        return <PrincipalTeachers onNavigate={navigateTo} />;
      case '/principal/parents':
        return <PrincipalParents onNavigate={navigateTo} />;
      case '/principal/analytics':
        return <PrincipalAnalytics onNavigate={navigateTo} />;
      case '/principal/settings':
        return <PrincipalSettings />;

      // Teacher Routes
      case '/teacher/dashboard':
      case '/teacher':
        return <TeacherDashboard onNavigate={navigateTo} />;
      case '/teacher/classes':
        return <TeacherClasses onNavigate={navigateTo} />;
      case '/teacher/attendance':
        return <TeacherAttendance onNavigate={navigateTo} />;
      case '/teacher/marks':
        return <TeacherMarks onNavigate={navigateTo} />;
      case '/teacher/requests':
        return <TeacherRequests />;
      case '/teacher/analytics':
        return <TeacherAnalytics />;

      // Parent Routes
      case '/parent/dashboard':
      case '/parent':
        return <ParentDashboard onNavigate={navigateTo} />;
      case '/parent/attendance':
        return <ParentAttendance />;
      case '/parent/marks':
        return <ParentMarks />;
      case '/parent/progress':
        return <ParentProgress />;
      case '/parent/notifications':
        return <ParentNotifications onNavigate={navigateTo} />;
      case '/parent/profile':
        return <ParentProfile />;

      // Fallback
      default:
        if (role === 'principal') return <PrincipalDashboard onNavigate={navigateTo} />;
        if (role === 'teacher') return <TeacherDashboard onNavigate={navigateTo} />;
        return <ParentDashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <DashboardLayout
      currentPath={currentPath}
      onNavigate={navigateTo}
      breadcrumbs={getBreadcrumbs()}
    >
      {renderCurrentRoute()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ERPDataProvider>
          <AppContent />
        </ERPDataProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
