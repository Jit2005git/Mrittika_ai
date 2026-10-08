import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, CloudSun, User, LogOut, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const navItems = [
    { name: t('nav.dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.cropPrediction', 'Crop Prediction'), path: '/crop-prediction', icon: Sprout },
    { name: t('nav.weather', 'Weather'), path: '/weather', icon: CloudSun },
    { name: t('nav.profile', 'Profile'), path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity animate-fadeIn"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        role="navigation"
        aria-label="Sidebar Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-250 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Mobile Dismiss Button */}
        <div>
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {t('app.name', 'Mrittika')}
                </span>
                <span className="text-3xs block -mt-1 font-semibold uppercase tracking-widest text-emerald-600">
                  {t('app.tagline', 'Agri-Intelligence')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
            <div className="px-3 pb-2 text-2xs font-bold text-slate-400 uppercase tracking-wider">
              {t('nav.farmerWorkspace', 'Farmer Workspace')}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 select-none ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-2xs border border-emerald-200/60'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="truncate">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Farmer profile snippet & Logout */}
        <div className="p-4 border-t border-slate-100">
          {user && (
            <div className="mb-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {user.name ? user.name[0].toUpperCase() : 'F'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 truncate">{user.name || 'Farmer'}</p>
                <p className="text-2xs text-slate-400 truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{t('common.verified', 'Verified Farmer')}</span>
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors focus:outline-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{t('nav.logout', 'Logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
