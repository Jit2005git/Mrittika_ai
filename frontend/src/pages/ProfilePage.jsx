import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  MapPin,
  Phone,
  Globe,
  Sprout,
  ShieldCheck,
  LogOut,
  Save,
  CheckCircle2,
  Layers,
  Award,
} from 'lucide-react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { t, language, setLanguage, supportedLanguages } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Sharma',
    email: user?.email || 'ramesh.farmer@mrittika.ai',
    location: user?.location || 'Hooghly, West Bengal',
    phone: user?.phone || '+91 98301 23456',
    language: language || 'en',
    farmSize: user?.farmSize || '5.2 Acres',
    soilType: user?.soilType || 'Fertile Alluvium (Clay Loam)',
    primaryCrop: user?.primaryCrop || 'Aman Rice & Mustard',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaveSuccess(false);

    // If changing language from profile form, also update global i18n
    if (name === 'language') {
      setLanguage(value);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl w-full mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('profile.title', 'Farmer Profile & Farm Account')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {t('profile.subtitle', 'Manage your personal credentials, farm characteristics, and interface preferences')}
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={LogOut}
          onClick={handleLogout}
          className="self-start sm:self-auto shadow-sm shadow-rose-600/20 text-xs sm:text-sm"
        >
          {t('profile.signOutBtn', 'Sign Out')}
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{t('profile.saveSuccess', 'Farmer profile and land parameters updated successfully!')}</span>
        </div>
      )}

      {/* Profile Overview Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-emerald-700/20 ring-4 ring-emerald-50 shrink-0">
            {formData.name ? formData.name[0].toUpperCase() : 'F'}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0 w-full">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 truncate max-w-full">
                {formData.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-3xs sm:text-xs font-bold bg-emerald-100 text-emerald-800 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('profile.verifiedBadge', 'Verified Farmer')}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{formData.email}</p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-3xs sm:text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{formData.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{formData.farmSize}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {supportedLanguages.find((l) => l.code === formData.language)?.nativeName || formData.language}
                </span>
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              variant={isEditing ? 'outline' : 'secondary'}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto text-xs"
            >
              {isEditing ? t('profile.cancelBtn', 'Cancel Editing') : t('profile.editBtn', 'Edit Profile')}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Profile Info / Edit Form */}
      <Card
        title={isEditing ? t('profile.cardTitleEdit', 'Update Farm Records') : t('profile.cardTitle', 'Farm Profile Details')}
        subtitle={t('profile.cardSubtitle', 'Agro-ecological records used to fine-tune AI recommendations')}
        icon={User}
      >
        <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t('profile.fullName', 'Farmer Full Name')}
              name="name"
              type="text"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label={t('profile.email', 'Email Address')}
              name="email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />

            <Input
              label={t('profile.phone', 'Contact Phone')}
              name="phone"
              type="tel"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label={t('profile.location', 'Farm Location')}
              name="location"
              type="text"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label={t('profile.farmSize', 'Total Farm Land Holding')}
              name="farmSize"
              type="text"
              icon={Layers}
              value={formData.farmSize}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label={t('profile.soilType', 'Predominant Soil Type')}
              name="soilType"
              type="text"
              icon={Sprout}
              value={formData.soilType}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label={t('profile.primaryCrop', 'Primary Cultivated Crops')}
              name="primaryCrop"
              type="text"
              icon={Award}
              value={formData.primaryCrop}
              onChange={handleChange}
              disabled={!isEditing}
            />

            {/* Language dropdown in profile form */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <label htmlFor="language" className="block text-3xs sm:text-xs font-semibold uppercase tracking-wider text-slate-700 truncate">
                {t('profile.prefLanguage', 'Preferred Language')}
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="w-4 h-4" />
                </div>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 flex flex-col-reverse xs:flex-row items-center justify-end gap-2.5 sm:gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsEditing(false)}
                className="w-full xs:w-auto text-xs"
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                icon={Save}
                className="w-full xs:w-auto text-xs"
              >
                {t('profile.saveChanges', 'Save Changes')}
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Security & Account Actions */}
      <Card
        title={t('profile.securityTitle', 'Session & Security')}
        subtitle={t('profile.securitySubtitle', 'Manage your session state and connected devices')}
        icon={ShieldCheck}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              {t('profile.signOutTitle', 'Sign Out of Mrittika')}
            </h4>
            <p className="text-3xs sm:text-xs text-slate-500 mt-0.5">
              {t('profile.signOutDesc', 'Clear your active session and cached telemetry on this device.')}
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            icon={LogOut}
            onClick={handleLogout}
            className="w-full sm:w-auto text-xs"
          >
            {t('profile.signOutBtn', 'Logout Account')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
