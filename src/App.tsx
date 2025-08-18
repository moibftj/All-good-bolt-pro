import React from 'react';
import { useState, useEffect } from 'react';
import { WelcomePage } from './pages/WelcomePage';
import { UserDashboard } from './pages/UserDashboard';
import { RemoteEmployeeDashboard } from './pages/RemoteEmployeeDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { FocusableLayout } from './components/layout/FocusableLayout';

function App() {
  const { isAuthenticated, userType } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('');
  const [previousRoute, setPreviousRoute] = useState('');

  useEffect(() => {
    // Track route changes for accessibility announcements
    const getRouteName = () => {
      if (!isAuthenticated) return 'Welcome Page';
      
      switch (userType) {
        case 'user': return 'User Dashboard';
        case 'remote_employee': return 'Remote Employee Dashboard';
        case 'admin': return 'Admin Dashboard';
        default: return 'Welcome Page';
      }
    };

    const newRoute = getRouteName();
    if (newRoute !== currentRoute) {
      setPreviousRoute(currentRoute);
      setCurrentRoute(newRoute);
    }
  }, [isAuthenticated, userType, currentRoute]);

  const skipLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    ...(isAuthenticated ? [{ href: '#user-menu', label: 'Skip to user menu' }] : [])
  ];

  const renderContent = () => {
    if (!isAuthenticated) {
      return <WelcomePage />;
    }

    switch (userType) {
      case 'user':
        return <UserDashboard />;
      case 'remote_employee':
        return <RemoteEmployeeDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <FocusableLayout
      currentRoute={currentRoute}
      previousRoute={previousRoute}
      skipLinks={skipLinks}
    >
      {renderContent()}
    </FocusableLayout>
  );
}

export default App;