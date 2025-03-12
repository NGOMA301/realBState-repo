import React from 'react';


export const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full';
  
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    outline: 'border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};