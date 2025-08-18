import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({
  label,
  error,
  helper,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={clsx(
            'w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-material-primary focus:border-material-primary',
            error 
              ? 'border-material-error focus:ring-material-error focus:border-material-error' 
              : 'border-gray-300',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-material-error">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
}