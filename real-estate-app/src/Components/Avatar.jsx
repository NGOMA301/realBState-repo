import React from 'react';


export const Avatar = ({
  src,
  alt = '',
  fallback,
  size = 'md',
  className = ''
}) => {
  const [error, setError] = React.useState(false);

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div className={`
      relative rounded-full overflow-hidden flex items-center justify-center
      bg-gray-100 dark:bg-gray-800
      ${sizes[size]}
      ${className}
    `}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {fallback || alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
};