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
    return isLogin ? 'Welcome back' : 'Start automating today';
  };

  const getRoleSubtitle = () => {
    return undefined;
  };

  if (!selectedRole) {
    return (
      <AuthLayout title="Welcome" subtitle="Professional Legal Document Platform">
        <RoleSelector onSelectRole={handleRoleSelect} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title={getRoleTitle()} 
      subtitle={getRoleSubtitle()}
      showToggle={selectedRole !== 'admin'}
      isLogin={isLogin}
      onToggle={setIsLogin}
      onClose={handleBack}
    >
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