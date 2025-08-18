import React from 'react';
import { clsx } from 'clsx';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={clsx(
      'dashboard-nav w-64 min-h-screen p-4 space-y-2',
      className
    )}>
      {children}
    </aside>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'nav-item w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium transition-all duration-200',
        active 
          ? 'active text-material-primary bg-blue-50' 
          : 'text-gray-700 hover:text-material-primary hover:bg-gray-50'
      )}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}