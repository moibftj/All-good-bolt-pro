import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { RoleSelector } from '../components/auth/RoleSelector';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

export function WelcomePage() {
  const [selectedRole, setSelectedRole] = useState<'user' | 'remote_employee' | 'admin' | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleRoleSelect = (role: 'user' | 'remote_employee' | 'admin') => {
    setSelectedRole(role);
    setIsLogin(true);
  };

  const handleBack = () => {
    setSelectedRole(null);
    setIsLogin(true);
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'user': return 'Regular User Access';
      case 'remote_employee': return 'Remote Employee Access';
      case 'admin': return 'Administrator Access';
      default: return '';
    }
  };

  const getRoleSubtitle = () => {
    switch (selectedRole) {
      case 'user': return 'Generate professional legal letters';
      case 'remote_employee': return 'Manage referrals and commissions';
      case 'admin': return 'System administration and oversight';
      default: return '';
    }
  };

  if (!selectedRole) {
    return (
      <AuthLayout title="Welcome" subtitle="Professional Legal Document Platform">
        <RoleSelector onSelectRole={handleRoleSelect} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title={getRoleTitle()} subtitle={getRoleSubtitle()}>
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="text-material-primary hover:underline text-sm font-medium"
        >
          ← Back to role selection
        </button>
      </div>

      {isLogin || selectedRole === 'admin' ? (
        <LoginForm
          userType={selectedRole}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          userType={selectedRole}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </AuthLayout>
  );
}