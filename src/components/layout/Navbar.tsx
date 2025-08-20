import React from 'react';
import { Scale, LogOut, User, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
  const { user, logout, userType } = useAuth();

  const getRoleLabel = () => {
    switch (userType) {
      case 'admin': return 'Admin';
      case 'remote_employee': return 'Remote Employee';
      case 'user': return 'User';
      default: return '';
    }
  };

  const getRoleBadgeColor = () => {
    switch (userType) {
      case 'admin': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'remote_employee': return 'bg-green-500/20 text-green-300 border border-green-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <nav 
      id="navigation" 
      className="dashboard-nav h-16 flex items-center justify-between px-6 border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center space-x-4">
        <Scale className="w-8 h-8 text-white" />
        <div>
          <h1 className="text-xl font-bold text-white">Talk-to-My-Lawyer</h1>
          <p className="text-sm text-white/70">Professional Legal Documents</p>
        </div>
      </div>

      {user && (
        <div id="user-menu" className="flex items-center space-x-4" role="region" aria-label="User menu">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
              {getRoleLabel()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-white" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="p-2"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}