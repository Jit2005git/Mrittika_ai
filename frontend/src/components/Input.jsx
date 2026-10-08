import React from 'react';

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  unit,
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  ...props
}) => {
  return (
    <div className={`w-full min-w-0 flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-3xs sm:text-xs font-semibold uppercase tracking-wider text-slate-700 truncate">
          {label} {required && <span className="text-emerald-600">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm min-w-0">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4 shrink-0" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          required={required}
          className={`w-full min-w-0 rounded-xl border transition-all duration-150 text-xs sm:text-sm font-medium py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400
            ${Icon ? 'pl-10' : ''}
            ${unit ? 'pr-14' : ''}
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 bg-rose-50/20'
              : 'border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white'
            }
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            focus:outline-none`}
          {...props}
        />

        {unit && (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="text-3xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[50px]">
              {unit}
            </span>
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-3xs sm:text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
