import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  className = '',
  bodyClassName = '',
  footer,
  hover = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5' : ''}
        ${className}`}
    >
      {(title || subtitle || Icon || action || badge) && (
        <div className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate">
                    {title}
                  </h3>
                )}
                {badge && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs sm:text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-3xs sm:text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0 self-end xs:self-center">{action}</div>}
        </div>
      )}

      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>

      {footer && <div className="px-4 sm:px-6 py-3 bg-slate-50/70 border-t border-slate-100">{footer}</div>}
    </div>
  );
};

export default Card;
