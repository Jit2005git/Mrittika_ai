import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sprout, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import LanguageSelector from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('farmer_test_1@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage(t('auth.fillAllFields', 'Please fill in both email and password.'));
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message || t('auth.signInError', 'Invalid email or password.'));
    }
  };

  const fillDemoCredentials = () => {
    setEmail('farmer_test_1@example.com');
    setPassword('password123');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top right language selector */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-2">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
            {t('app.name', 'Mrittika')}
          </span>
        </Link>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t('auth.welcomeBack', 'Welcome back')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          {t('auth.signInPrompt', 'Sign in to access your agricultural telemetry & crop models')}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 w-full max-w-md mx-auto">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl border border-slate-200/80">
          {/* Demo account banner */}
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800 flex items-center justify-between gap-2">
            <span>{t('auth.demoAccountBanner', '⚡ Demo account prefilled')}</span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="font-bold underline hover:text-emerald-950 transition-colors shrink-0"
            >
              {t('auth.resetValues', 'Reset values')}
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t('auth.signInError', 'Sign in error')}</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <Input
              label={t('auth.emailLabel', 'Email address')}
              name="email"
              type="email"
              icon={Mail}
              placeholder="kisan@mrittika.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label={t('auth.passwordLabel', 'Password')}
                name="password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-9 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon={LogIn}
              className="w-full text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 py-3.5"
            >
              {t('auth.signInBtn', 'Sign In to Mrittika')}
            </Button>
          </form>

          {/* Switch to Signup */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              {t('auth.noAccount', "Don't have an account yet?")}{' '}
              <Link
                to="/signup"
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                {t('auth.createAccountLink', 'Create Account')}{' '}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-5 text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors">
            &larr; {t('auth.returnHome', 'Return to Homepage')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
