import React, { useState } from 'react';
import { Sidebar } from '../common/Sidebar';
import { TopNavbar } from '../common/TopNavbar';
import { Breadcrumb } from '../common/Breadcrumb';

interface DashboardLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  breadcrumbs?: { label: string; href?: string; onClick?: () => void }[];
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentPath,
  onNavigate,
  breadcrumbs = [],
  children,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar
          onOpenMobile={() => setIsMobileOpen(true)}
          onNavigate={onNavigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {breadcrumbs.length > 0 && (
            <div className="pb-1">
              <Breadcrumb
                items={breadcrumbs}
                onNavigateHome={() => {
                  const rolePrefix = currentPath.split('/')[1] || 'principal';
                  onNavigate(`/${rolePrefix}/dashboard`);
                }}
              />
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};
