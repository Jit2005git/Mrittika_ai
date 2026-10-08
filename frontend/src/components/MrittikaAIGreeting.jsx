import React from 'react';
import { Bot, Sparkles, Layers, CloudSun, Sprout, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Link } from 'react-router-dom';

export const MrittikaAIGreeting = ({ weather, soil, className = '' }) => {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/70 p-5 sm:p-7 shadow-sm transition-all ${className}`}
      role="region"
      aria-label="Mrittika AI Assistant Greeting"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Assistant Persona */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 ring-4 ring-emerald-100">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t('ai.dashboardGreetingTitle', 'Good to see you!')}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                {t('ai.assistantName', 'Mrittika AI')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
              {t(
                'ai.dashboardGreetingMsg',
                "I'm Mrittika AI, your agricultural intelligence assistant. I analyze your soil chemistry, regional microclimate, and crop models to guide your seasonal farming decisions."
              )}
            </p>
          </div>
        </div>

        {/* Action Link */}
        <div className="shrink-0 self-start sm:self-center">
          <Link
            to="/crop-prediction"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200/70 border border-emerald-200 transition-colors"
          >
            <span>{t('dashboard.newPredictionBtn', 'New Prediction')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Real Data-Supported Insights Grid */}
      <div className="mt-5 pt-4 border-t border-emerald-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Soil Insight */}
        <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('dashboard.soilProfileTitle', 'Soil Health')}</span>
          </div>
          <p className="text-slate-600 text-3xs sm:text-2xs leading-relaxed">
            {soil?.pHLevel
              ? `pH: ${soil.pHLevel} (${soil.pHClassification || 'Optimal'}). ${t('ai.dashboardInsights.soil')}`
              : t('ai.dashboardInsights.soil')}
          </p>
        </div>

        {/* Weather Insight */}
        <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-teal-700 font-bold mb-1">
            <CloudSun className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('weather.liveFarmClimate', 'Climate Telemetry')}</span>
          </div>
          <p className="text-slate-600 text-3xs sm:text-2xs leading-relaxed">
            {weather?.temperature
              ? `${weather.temperature}°C, ${weather.humidity}% humidity. ${t('ai.dashboardInsights.weather')}`
              : t('ai.dashboardInsights.weather')}
          </p>
        </div>

        {/* Crop Recommendation Insight */}
        <div className="p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('dashboard.featuredCropTitle', 'Crop Recommendation')}</span>
          </div>
          <p className="text-slate-600 text-3xs sm:text-2xs leading-relaxed">
            {t('ai.dashboardInsights.crop')}
          </p>
        </div>

        {/* Next Action */}
        <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('ai.result.nextStepsTitle', 'Next Action')}</span>
          </div>
          <p className="text-emerald-900 text-3xs sm:text-2xs leading-relaxed font-medium">
            {t('ai.dashboardInsights.action')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MrittikaAIGreeting;
