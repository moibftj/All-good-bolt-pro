import React from 'react';
import { SkipLinks } from '../accessibility/SkipLinks';
import { FocusManager, RouteChangeAnnouncer } from '../accessibility/FocusManager';

interface FocusableLayoutProps {
  children: React.ReactNode;
  currentRoute?: string;
  previousRoute?: string;
  skipLinks?: Array<{ href: string; label: string }>;
}

export function FocusableLayout({ 
  children, 
  currentRoute,
  previousRoute,
  skipLinks 
}: FocusableLayoutProps) {
  return (
    <div className="app-layout">
      {/* Skip Links - Must be first focusable element */}
      <SkipLinks links={skipLinks} />
      
      {/* Screen reader announcements */}
      {currentRoute && (
        <RouteChangeAnnouncer 
          routeName={currentRoute}
          previousRoute={previousRoute}
        />
      )}
      
      {/* Live region for dynamic announcements */}
      <div 
        id="live-region" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      />
      
      {/* Focus management wrapper */}
      <FocusManager announceChanges={true}>
        {children}
      </FocusManager>
      
      {/* Hidden focusable element to prevent tab cycling issues */}
      <div 
        tabIndex={-1}
        style={{ 
          position: 'absolute', 
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// Utility component for marking main content areas
interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  skipFocus?: boolean;
}

export function MainContent({ children, className = '', skipFocus = false }: MainContentProps) {
  return (
    <main 
      id="main-content"
      className={className}
      tabIndex={skipFocus ? -1 : 0}
      role="main"
      aria-label="Main content"
    >
      {children}
    </main>
  );
}

// Utility component for navigation landmarks
interface NavigationProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function Navigation({ children, className = '', label = 'Main navigation' }: NavigationProps) {
  return (
    <nav 
      id="navigation"
      className={className}
      role="navigation"
      aria-label={label}
    >
      {children}
    </nav>
  );
}