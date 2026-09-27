import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export const Breadcrumb: React.FC<{
  items: BreadcrumbItem[];
  onNavigateHome?: () => void;
}> = ({ items, onNavigateHome }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium whitespace-nowrap overflow-x-auto py-1">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
      </button>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 font-semibold">{item.label}</span>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-slate-500">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
