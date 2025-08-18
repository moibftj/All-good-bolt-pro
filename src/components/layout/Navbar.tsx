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
      case 'admin': return 'bg-red-100 text-red-800';
      case 'remote_employee': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <Scale className="w-8 h-8 text-material-primary" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Talk-to-My-Lawyer</h1>
          <p className="text-sm text-gray-500">Professional Legal Documents</p>
        </div>
      </div>

      {user && (
        <div id="user-menu" className="flex items-center space-x-4" role="region" aria-label="User menu">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
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
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout} 
              className="p-2"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}