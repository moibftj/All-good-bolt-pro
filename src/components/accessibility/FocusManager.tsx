import React, { useEffect, useRef } from 'react';
import { useAnnounceLiveRegion } from '../../hooks/useFocusManagement';

interface FocusManagerProps {
  children: React.ReactNode;
  announceChanges?: boolean;
  announcementDelay?: number;
}

export function FocusManager({ 
  children, 
  announceChanges = false,
  announcementDelay = 500 
}: FocusManagerProps) {
  const announce = useAnnounceLiveRegion();
  const previousContentRef = useRef<string>('');

  useEffect(() => {
    if (!announceChanges) return;

    const handleContentChange = () => {
      // Simple content change detection for announcements
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        const currentContent = mainContent.textContent || '';
        if (currentContent !== previousContentRef.current && previousContentRef.current !== '') {
          setTimeout(() => {
            announce('Page content has been updated', 'polite');
          }, announcementDelay);
        }
        previousContentRef.current = currentContent;
      }
    };

    // Use MutationObserver to detect content changes
    const observer = new MutationObserver(handleContentChange);
    const mainContent = document.querySelector('#main-content');
    
    if (mainContent) {
      observer.observe(mainContent, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [announce, announceChanges, announcementDelay]);

  return <>{children}</>;
}

interface RouteChangeAnnouncerProps {
  routeName: string;
  previousRoute?: string;
}

export function RouteChangeAnnouncer({ routeName, previousRoute }: RouteChangeAnnouncerProps) {
  const announce = useAnnounceLiveRegion();

  useEffect(() => {
    if (previousRoute && previousRoute !== routeName) {
      // Announce route changes for screen readers
      setTimeout(() => {
        announce(`Navigated to ${routeName}`, 'assertive');
      }, 100);
    }
  }, [routeName, previousRoute, announce]);

  return null;
}

interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  completedMessage?: string;
}

export function LoadingAnnouncer({ 
  isLoading, 
  loadingMessage = 'Loading content, please wait',
  completedMessage = 'Content loaded successfully'
}: LoadingAnnouncerProps) {
  const announce = useAnnounceLiveRegion();

  useEffect(() => {
    if (isLoading) {
      announce(loadingMessage, 'assertive');
    } else {
      // Small delay to ensure loading state has actually changed
      setTimeout(() => {
        announce(completedMessage, 'polite');
      }, 500);
    }
  }, [isLoading, loadingMessage, completedMessage, announce]);

  return null;
}