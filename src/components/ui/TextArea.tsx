import React from 'react';
import { clsx } from 'clsx';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  children?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({
  className,
  error,
  ...props
}) => {
  return (
    <textarea
      className={clsx(
        'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  );
};