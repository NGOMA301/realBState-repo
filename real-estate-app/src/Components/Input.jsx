import React from 'react';

export const Input = ({ 
  className = '', 
  error,
  disabled,
  ...props 
}) => {
  return (
    <div className="relative">
      <input
        className={`
          w-full px-4 py-2 rounded-lg border border-gray-200 
          bg-white text-gray-900 placeholder-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
          dark:placeholder-gray-500 dark:focus:ring-blue-500
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};