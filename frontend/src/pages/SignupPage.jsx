import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, Sprout, ArrowRight } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import LanguageSelector from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage(t('auth.fillAllFields', 'Please fill in all required fields.'));
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage(
        t('auth.passwordLengthErr', 'Password must be at least 6 characters long.')
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(
        t('auth.passwordsDoNotMatch', 'Passwords do not match. Please verify.')
      );
      return;
    }

    setIsLoading(true);
    const result = await signup(formData.name, formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(result.message || 'Registration failed. Try again.');
    }
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
          {t('auth.createAccountTitle', 'Create your farm account')}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          {t('auth.createAccountSubtitle', 'Join thousands of farmers using precision intelligence')}
        </p>
      </div>

      {/* Signup Form Card */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 w-full max-w-md mx-auto">
        <div className="bg-white py-6 px-4 sm:py-8 sm:px-10 shadow-xl shadow-slate-200/50 rounded-2xl sm:rounded-3xl border border-slate-200/80">
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{t('auth.signInError', 'Registration notice')}</p>
                <p className="mt-0.5 text-rose-700">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5 sm:space-y-4">
            <Input
              label={t('auth.fullNameLabel', 'Full Name')}
              name="name"
              type="text"
              icon={User}
              placeholder="e.g. Ramesh Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label={t('auth.emailLabel', 'Email Address')}
              name="email"
              type="email"
              icon={Mail}
              placeholder="farmer@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label={t('auth.passwordLabel', 'Password')}
              name="password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              helperText={t('auth.passwordHelper', 'Minimum 6 characters')}
              required
            />

            <Input
              label={t('auth.confirmPasswordLabel', 'Confirm Password')}
              name="confirmPassword"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                icon={UserPlus}
                className="w-full text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 py-3.5"
              >
                {t('auth.createAccountBtn', 'Create Farmer Account')}
              </Button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              {t('auth.alreadyRegistered', 'Already registered with Mrittika?')}{' '}
              <Link
                to="/login"
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                {t('nav.login', 'Sign In')}{' '}
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

export default SignupPage;
