import { useEffect, useRef, useCallback } from 'react';

interface FocusManagementOptions {
  restoreOnUnmount?: boolean;
  autoFocus?: boolean;
}

export function useFocusManagement(options: FocusManagementOptions = {}) {
  const { restoreOnUnmount = true, autoFocus = false } = options;
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Store the currently focused element
    if (document.activeElement instanceof HTMLElement) {
      previousActiveElementRef.current = document.activeElement;
    }

    // Auto-focus the container if requested
    if (autoFocus && containerRef.current) {
      containerRef.current.focus();
    }

    return () => {
      // Restore focus to the previously active element
      if (restoreOnUnmount && previousActiveElementRef.current) {
        // Use a small delay to ensure the element is still in the DOM
        setTimeout(() => {
          if (previousActiveElementRef.current && 
              document.contains(previousActiveElementRef.current)) {
            previousActiveElementRef.current.focus();
          }
        }, 0);
      }
    };
  }, [autoFocus, restoreOnUnmount]);

  const setFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'details',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors))
      .filter(el => {
        const element = el as HTMLElement;
        return element.offsetWidth > 0 && 
               element.offsetHeight > 0 && 
               !element.hasAttribute('aria-hidden');
      }) as HTMLElement[];
  }, []);

  const focusFirst = useCallback(() => {
    const focusableElements = setFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [setFocusableElements]);

  const focusLast = useCallback(() => {
    const focusableElements = setFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [setFocusableElements]);

  return {
    containerRef,
    focusFirst,
    focusLast,
    previousActiveElement: previousActiveElementRef.current,
    getFocusableElements: setFocusableElements
  };
}

export function useFocusTrap(isActive: boolean = true) {
  const { containerRef, getFocusableElements } = useFocusManagement({ 
    restoreOnUnmount: true 
  });

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Let parent components handle escape
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive, getFocusableElements]);

  return containerRef;
}

export function useAnnounceLiveRegion() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove the announcement after it's been read
    setTimeout(() => {
      document.body.removeChild(liveRegion);
    }, 1000);
  }, []);

  return announce;
}