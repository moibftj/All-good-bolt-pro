import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  glass?: boolean;
}

export function Card({ 
  children, 
  className, 
  elevated = false, 
  glass = false, 
  onClick,
  ...rest 
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border transition-all duration-300',
        glass 
          ? 'material-glass-card' 
          : 'bg-white border-gray-200 shadow-material-1',
        elevated && 'shadow-material-2 hover:shadow-material-3',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}