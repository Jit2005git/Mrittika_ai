import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import {
  Sprout,
  CloudSun,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const LandingPage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col overflow-x-hidden">
      {/* Public Navbar with responsive Language Selector and Mobile Hamburger */}
      <Navbar isPublic />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 lg:pt-20 lg:pb-28">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 via-emerald-50/20 to-transparent pointer-events-none rounded-b-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-3xs sm:text-xs font-bold uppercase tracking-wider mb-5 sm:mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t('landing.pill', 'Next-Gen Agricultural Intelligence')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15]">
              {t('landing.headline', 'Empowering Farmers with Precision')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 block sm:inline mt-1 sm:mt-0">
                {t('landing.headlineHighlight', 'AI & Soil Intelligence')}
              </span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto px-2">
              {t(
                'landing.subheading',
                'Mrittika bridges real-time microclimate sensors, soil macronutrient chemistry, and predictive machine learning models to maximize crop yield and preserve agricultural vitality.'
              )}
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto shadow-lg shadow-emerald-700/20 py-3.5"
                >
                  {t('landing.getStartedBtn', 'Get Started Free')}
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto py-3.5">
                  {t('landing.signInBtn', 'Sign In to Dashboard')}
                </Button>
              </Link>
            </div>

            {/* Trust metrics */}
            <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200/80 flex flex-col xs:flex-row flex-wrap items-center justify-center gap-3 sm:gap-8 text-3xs sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('landing.paramCount', '7 Agro-Climatic Parameters')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('landing.weatherTelemetry', 'Real-Time Weather Telemetry')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('landing.modelPrecision', '94%+ Model Precision')}</span>
              </span>
            </div>
          </div>

          {/* Interactive Preview Mockup Card */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-3xl p-2.5 sm:p-3 bg-white/70 backdrop-blur-md border border-slate-200/80 shadow-2xl shadow-emerald-950/10">
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-5 sm:p-8 text-white">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 sm:pb-4 mb-4 sm:mb-6 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-3xs sm:text-xs font-mono text-slate-400 ml-1 truncate">
                    {t('landing.previewConsole', 'mrittika.ai/intelligence-console')}
                  </span>
                </div>
                <span className="text-3xs sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  {t('landing.previewInference', 'ML Inference Live')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                <div className="bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-700">
                  <div className="text-3xs sm:text-xs text-slate-400 font-medium">
                    {t('dashboard.soilProfileTitle', 'Tested Soil Sample')}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1">N: 90 • P: 42 • K: 43</div>
                  <p className="text-3xs sm:text-xs text-emerald-400 mt-1 sm:mt-2">
                    {t('dashboard.balanced', 'Optimal balance (pH 6.5)')}
                  </p>
                </div>
                <div className="bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-700">
                  <div className="text-3xs sm:text-xs text-slate-400 font-medium">
                    {t('weather.liveFarmClimate', 'Microclimate Feed')}
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white mt-1">26.5°C • 82% Humidity</div>
                  <p className="text-3xs sm:text-xs text-teal-400 mt-1 sm:mt-2">
                    Rainfall: 202 mm recorded
                  </p>
                </div>
                <div className="bg-emerald-950/80 p-3.5 sm:p-4 rounded-xl border border-emerald-500/40">
                  <div className="text-3xs sm:text-xs text-emerald-300 font-semibold">
                    {t('dashboard.featuredCropTitle', 'Recommended Crop')}
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-200 mt-1">Rice (Paddy)</div>
                  <p className="text-3xs sm:text-xs text-emerald-400 mt-1 sm:mt-2">
                    {t('common.confidence', 'Suitability')}: 94.8%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              {t('landing.capabilitiesTitle', 'Core Capabilities')}
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
              {t('landing.capabilitiesHeadline', 'Integrated Intelligence for Modern Farming')}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-3">
              {t(
                'landing.capabilitiesDesc',
                'Engineered to translate complex agricultural datasets into instant, actionable farm decisions.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1: Crop Intelligence */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500/60 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('landing.cropIntelTitle', 'Crop Intelligence')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {t(
                  'landing.cropIntelDesc',
                  'Harness predictive ML models trained on Nitrogen, Phosphorus, Potassium, soil pH, and environmental conditions to select optimal crops.'
                )}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                <span>{t('landing.paramCount', '7 parameters')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 2: Weather Intelligence */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500/60 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CloudSun className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('landing.weatherIntelTitle', 'Weather Intelligence')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {t(
                  'landing.weatherIntelDesc',
                  'Hyperlocal atmospheric telemetry tracking temperature, precipitation likelihood, relative humidity, and soil evaporation rates.'
                )}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-teal-600">
                <span>{t('weather.forecastTitle', 'Forecast & alerts')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Feature 3: Smart Recommendations */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-500/60 transition-all hover:shadow-lg group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {t('landing.recomIntelTitle', 'Smart Recommendations')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {t(
                  'landing.recomIntelDesc',
                  'Get tailored guidance on fertilization schedules, water irrigation timing, pest risk warnings, and harvesting windows.'
                )}
              </p>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <span>{t('dashboard.advisoriesTitle', 'Advisories & insights')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm sm:text-base">{t('app.name', 'Mrittika')}</span>
            <span className="text-slate-400 text-3xs sm:text-xs">
              | {t('landing.footerCopy', 'Built for agricultural excellence.')}
            </span>
          </div>

          <p className="text-center sm:text-right text-3xs sm:text-xs">
            &copy; {new Date().getFullYear()} {t('app.name', 'Mrittika AI')}.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
