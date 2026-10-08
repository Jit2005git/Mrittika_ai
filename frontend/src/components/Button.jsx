import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow shadow-emerald-600/20 focus:ring-emerald-500',
    secondary: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 focus:ring-emerald-500',
    outline: 'border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 focus:ring-slate-400',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow shadow-rose-600/20 focus:ring-rose-500',
    earth: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow focus:ring-amber-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'emerald'} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
