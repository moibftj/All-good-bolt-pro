/**
 * Focus management utilities for accessibility compliance
 */

export function focusElement(selector: string, delay = 0): void {
  setTimeout(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
    }
  }, delay);
}

export function focusElementById(id: string, delay = 0): void {
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
    }
  }, delay);
}

export function getNextFocusableElement(currentElement: HTMLElement, direction: 'forward' | 'backward' = 'forward'): HTMLElement | null {
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

  const focusableElements = Array.from(document.querySelectorAll(focusableSelectors))
    .filter(el => {
      const element = el as HTMLElement;
      return element.offsetWidth > 0 && 
             element.offsetHeight > 0 && 
             !element.hasAttribute('aria-hidden');
    }) as HTMLElement[];

  const currentIndex = focusableElements.indexOf(currentElement);
  
  if (currentIndex === -1) return null;

  const nextIndex = direction === 'forward' 
    ? (currentIndex + 1) % focusableElements.length
    : currentIndex === 0 
      ? focusableElements.length - 1 
      : currentIndex - 1;

  return focusableElements[nextIndex];
}

export function createFocusRing(element: HTMLElement): void {
  element.style.outline = '2px solid #1976D2';
  element.style.outlineOffset = '2px';
}

export function removeFocusRing(element: HTMLElement): void {
  element.style.outline = '';
  element.style.outlineOffset = '';
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function handleRouteChange(routeName: string): void {
  // Focus main content area
  focusElementById('main-content', 100);
  
  // Announce route change
  announceToScreenReader(`Navigated to ${routeName}`, 'assertive');
}

export function setupKeyboardNavigation(): void {
  document.addEventListener('keydown', (event) => {
    // Skip to main content with Ctrl+/
    if (event.ctrlKey && event.key === '/') {
      event.preventDefault();
      focusElementById('main-content');
    }
    
    // Skip to navigation with Ctrl+Shift+N
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
      event.preventDefault();
      focusElementById('navigation');
    }
  });
}

export function validateFocusOrder(): boolean {
  const focusableElements = document.querySelectorAll([
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', '));

  let isValid = true;
  let previousTabIndex = -Infinity;

  focusableElements.forEach((element) => {
    const tabIndex = parseInt((element as HTMLElement).getAttribute('tabindex') || '0');
    
    if (tabIndex < previousTabIndex) {
      console.warn('Focus order violation detected:', element);
      isValid = false;
    }
    
    previousTabIndex = tabIndex;
  });

  return isValid;
}

// Initialize focus management when the module loads
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupKeyboardNavigation);
}