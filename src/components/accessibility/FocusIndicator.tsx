import React, { useState, useEffect } from 'react';

/**
 * Component that provides visual focus indicators for better accessibility
 */
export function FocusIndicator() {
  const [isUsingKeyboard, setIsUsingKeyboard] = useState(false);

  useEffect(() => {
    let keyboardUsed = false;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
        keyboardUsed = true;
        setIsUsingKeyboard(true);
        document.body.classList.add('using-keyboard');
      }
    };

    const handleMouseDown = () => {
      if (keyboardUsed) {
        keyboardUsed = false;
        setIsUsingKeyboard(false);
        document.body.classList.remove('using-keyboard');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <style jsx global>{`
      /* Only show focus outlines when using keyboard navigation */
      .using-keyboard *:focus {
        outline: 2px solid #1976D2 !important;
        outline-offset: 2px !important;
      }

      /* Enhanced focus styles for interactive elements when using keyboard */
      .using-keyboard button:focus,
      .using-keyboard .material-button:focus {
        outline: 2px solid #fff !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px #1976D2 !important;
      }

      .using-keyboard a:focus {
        outline: 2px solid #1976D2 !important;
        outline-offset: 2px !important;
        background-color: rgba(25, 118, 210, 0.1) !important;
      }

      .using-keyboard input:focus,
      .using-keyboard select:focus,
      .using-keyboard textarea:focus {
        outline: 2px solid #1976D2 !important;
        outline-offset: 1px !important;
        border-color: #1976D2 !important;
        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1) !important;
      }

      /* Hide focus outlines for mouse users */
      body:not(.using-keyboard) *:focus {
        outline: none;
      }

      /* Ensure skip links are always visible when focused */
      .skip-link:focus {
        outline: 2px solid #fff !important;
        outline-offset: 2px !important;
      }
    `}</style>
  );
}