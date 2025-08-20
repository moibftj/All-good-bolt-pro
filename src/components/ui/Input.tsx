import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="space-y-1">
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              material-input
              w-full
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              ${error ? 'border-red-500 focus:border-red-500' : ''}
              ${className}
            `}
            placeholder=" "
            {...props}
          />
          
          {label && (
            <label
              htmlFor={inputId}
              className={`
                material-input-label
                ${leftIcon ? 'left-12' : 'left-4'}
                ${error ? 'text-red-500' : ''}
              `}
            >
              {label}
            </label>
          )}
          
          {rightIcon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
        
        {helper && !error && (
          <p className="text-sm text-gray-400 mt-1">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';