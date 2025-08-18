import React from 'react';
import { Scale } from 'lucide-react';
import { Card } from '../ui/Card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <Card glass className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Scale className="w-12 h-12 text-material-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Talk-to-My-Lawyer</h1>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
      </Card>
    </div>
  );
}