import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, Bell, CloudSun, LogIn, UserPlus, Home, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

export const Navbar = ({ onOpenSidebar, isPublic = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic titles mapping for authenticated views
  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
        return t('nav.dashboard', 'Farmer Overview');
      case '/crop-prediction':
        return t('nav.cropPrediction', 'Crop Prediction Intelligence');
      case '/weather':
        return t('nav.weather', 'Real-Time Agro-Weather');
      case '/profile':
        return t('nav.profile', 'Farmer Profile & Settings');
      default:
        return t('app.name', 'Mrittika AI');
    }
  };

  const currentTitle = getPageTitle(location.pathname);

  // ==========================================
  // PUBLIC NAVBAR (Landing, Login, Signup)
  // ==========================================
  if (isPublic) {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                {t('app.name', 'Mrittika')}
              </span>
              <span className="text-3xs block -mt-1 font-semibold uppercase tracking-widest text-emerald-600 hidden xs:block">
                {t('app.tagline', 'Agri-Intelligence')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items + Language Selector */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <LanguageSelector />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{t('nav.goToDashboard', 'Go to Dashboard')}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav.login', 'Sign In')}</span>
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('nav.signup', 'Get Started')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Language Selector + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-fadeIn shadow-lg">
            <nav className="space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Home className="w-4 h-4 text-emerald-600" />
                <span>{t('nav.home', 'Home')}</span>
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                  <span>{t('nav.goToDashboard', 'Go to Dashboard')}</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LogIn className="w-4 h-4 text-slate-400" />
                    <span>{t('nav.login', 'Sign In')}</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4 text-white" />
                    <span>{t('nav.signup', 'Get Started')}</span>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Language Grid inside Menu */}
            <div className="pt-3 border-t border-slate-100">
              <LanguageSelector variant="mobile-grid" />
            </div>
          </div>
        )}
      </header>
    );
  }

  // ==========================================
  // AUTHENTICATED TOP NAVBAR (Inside DashboardLayout)
  // ==========================================
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
      {/* Left: Mobile Sidebar Hamburger & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shrink-0"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Right Controls: Weather pill, Language Selector, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Quick Weather pill (hidden on small mobile screens to prevent overflow) */}
        <Link
          to="/weather"
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <CloudSun className="w-3.5 h-3.5 text-emerald-600" />
          <span>28.4°C • Gangetic Plain</span>
        </Link>

        {/* Language Selector in Authenticated Topbar */}
        <LanguageSelector />

        {/* Notification Bell */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-1.5 sm:pl-3 border-l border-slate-200"
          aria-label="Farmer profile"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-emerald-500/20">
            {user?.name ? user.name[0].toUpperCase() : 'M'}
          </div>
          <span className="hidden xl:block text-xs font-semibold text-slate-700 truncate max-w-[120px]">
            {user?.name || 'Farmer'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
