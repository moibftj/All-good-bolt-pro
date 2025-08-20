import React from 'react';
import { Scale, X } from 'lucide-react';
import { Card } from '../ui/Card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showToggle?: boolean;
  isLogin?: boolean;
  onToggle?: (isLogin: boolean) => void;
  onClose?: () => void;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showToggle = false,
  isLogin = true,
  onToggle,
  onClose 
}: AuthLayoutProps) {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <Card glass className="w-full max-w-md relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="auth-close-button"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Auth Toggle */}
        {showToggle && onToggle && (
          <div className="flex justify-center mb-6">
            <div className="auth-toggle">
              <button
                className={`auth-toggle-button ${!isLogin ? 'active' : ''}`}
                onClick={() => onToggle(false)}
              >
                Sign up
              </button>
              <button
                className={`auth-toggle-button ${isLogin ? 'active' : ''}`}
                onClick={() => onToggle(true)}
              >
                Sign in
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-white/70">{subtitle}</p>}
        </div>
        {children}
      </Card>
    </div>
  );
}