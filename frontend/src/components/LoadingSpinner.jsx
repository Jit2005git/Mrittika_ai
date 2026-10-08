import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'emerald', text }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
    xl: 'w-14 h-14 border-4',
  }[size] || 'w-6 h-6 border-2';

  const colorClasses = {
    emerald: 'border-emerald-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-500 border-t-transparent',
  }[color] || 'border-emerald-600 border-t-transparent';

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses} ${colorClasses} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="text-sm font-medium text-slate-600 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
