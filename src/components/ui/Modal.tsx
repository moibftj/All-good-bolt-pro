import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { useFocusTrap } from '../../hooks/useFocusManagement';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Focus the modal when it opens
      setTimeout(() => {
        if (focusTrapRef.current) {
          const firstFocusable = focusTrapRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            focusTrapRef.current.focus();
          }
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, focusTrapRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <div 
          ref={focusTrapRef}
          className={`inline-block w-full ${sizeClasses[size]} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative z-10`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}