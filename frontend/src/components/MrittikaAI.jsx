import React from 'react';
import {
  Sparkles,
  Bot,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  CloudSun,
  ListChecks,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

/**
 * Reusable Mrittika AI Farming Assistant Card
 * Supports states: 'empty', 'loading', 'success', 'error'
 */
export const MrittikaAI = ({
  state = 'empty', // 'empty' | 'loading' | 'success' | 'error'
  result = null,
  errorMessage = '',
  onReset = null,
  className = '',
}) => {
  const { t } = useLanguage();

  // Helper to retrieve crop-specific AI reasoning in the active language
  const getCropReasoning = (cropKey = 'rice') => {
    const key = (cropKey || 'rice').toLowerCase().trim();
    const prefix = `ai.result.${key}`;

    return {
      why: t(`${prefix}Why`, t('ai.result.riceWhy')),
      soil: t(`${prefix}Soil`, t('ai.result.riceSoil')),
      weather: t(`${prefix}Weather`, t('ai.result.riceWeather')),
      next: t(`${prefix}Next`, t('ai.result.riceNext')),
    };
  };

  return (
    <div
      className={`rounded-3xl border-2 border-emerald-500/80 bg-white shadow-xl shadow-emerald-950/5 overflow-hidden transition-all duration-300 ${className}`}
      role="region"
      aria-label="Mrittika AI Farming Assistant"
    >
      {/* 1. Assistant Header & Friendly Persona */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Friendly Assistant Avatar with agricultural sprout */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-emerald-950 flex items-center justify-center shadow-md ring-4 ring-white/20">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-emerald-900 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  {t('ai.assistantName', 'Mrittika AI')}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100 backdrop-blur-xs">
                  {t('ai.assistantRole', 'AI Farming Assistant')}
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {t('ai.badge', 'Agro-Intelligence Assistant')}
              </p>
            </div>
          </div>

          {/* Mode Badge: Live Backend vs Demo Simulation */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            {result?.source === 'backend' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('app.backendConnected', 'Live Backend')}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-3xs font-bold bg-amber-400/90 text-amber-950 border border-amber-300/40 shadow-xs">
                <Sparkles className="w-3 h-3" />
                {t('app.demoMode', 'Demo Mode')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Conversational Body Based on State */}
      <div className="p-5 sm:p-7">
        {/* State: LOADING */}
        {state === 'loading' && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
            <LoadingSpinner size="lg" color="emerald" />
            <div className="max-w-md">
              <h4 className="text-base font-bold text-slate-800">
                {t('common.processing', 'Processing...')}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                "{t('ai.states.loading', 'Let me check your soil and weather conditions...')}"
              </p>
            </div>
          </div>
        )}

        {/* State: ERROR */}
        {state === 'error' && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-950">
                  {t('prediction.errorTitle', 'Prediction Error')}
                </h4>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  "{t('ai.states.error', "I couldn't get the prediction right now. Please check your inputs and try again.")}"
                </p>
                {errorMessage && (
                  <p className="text-3xs font-mono bg-rose-100/60 p-2 rounded-lg mt-2 text-rose-900 break-words">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State: EMPTY */}
        {state === 'empty' && (
          <div className="py-6 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {t('ai.assistantName', 'Mrittika AI')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              "{t('ai.states.empty', 'Enter your soil and weather information above, and I will help you choose a suitable crop for your land.')}"
            </p>
          </div>
        )}

        {/* State: SUCCESS */}
        {state === 'success' && result && (
          <div className="space-y-6 animate-fadeIn">
            {/* Friendly conversational speech bubble */}
            <div className="relative p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-slate-800">
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 select-none">💬</span>
                <div>
                  <span className="text-xs font-bold text-emerald-900 block mb-0.5">
                    {t('ai.assistantName', 'Mrittika AI')} says:
                  </span>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    "{t('ai.states.success', "Based on the soil and weather conditions you provided, here's what I'd recommend:")}"
                  </p>
                </div>
              </div>
            </div>

            {/* Core Recommendation Card */}
            <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/40">
                <div>
                  <span className="text-3xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100">
                    {t('ai.result.recommendationTitle', 'Recommended Crop')}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1.5 capitalize flex items-center gap-2">
                    {result.crop}
                    <CheckCircle2 className="w-6 h-6 text-emerald-300 inline shrink-0" />
                  </h2>
                  {result.details?.scientificName && (
                    <p className="text-xs text-emerald-200 italic font-serif mt-0.5">
                      {result.details.scientificName} • {result.details.category}
                    </p>
                  )}
                </div>

                <div className="sm:text-right bg-white/10 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-200">
                    {result.confidence}%
                  </span>
                  <p className="text-3xs uppercase font-bold tracking-wider text-emerald-100">
                    {t('common.confidence', 'Confidence')}
                  </p>
                </div>
              </div>

              {/* Quick Agronomic Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4">
                <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-400/20 text-xs">
                  <span className="text-3xs text-emerald-200 block uppercase font-bold">
                    {t('dashboard.growthCycle', 'Growth Cycle')}
                  </span>
                  <span className="font-bold text-white mt-0.5 block">
                    {result.details?.growingPeriod || '110 - 140 days'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-400/20 text-xs">
                  <span className="text-3xs text-emerald-200 block uppercase font-bold">
                    {t('dashboard.waterNeed', 'Water Need')}
                  </span>
                  <span className="font-bold text-white mt-0.5 block">
                    {result.details?.waterRequirement || 'Moderate'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-400/20 text-xs">
                  <span className="text-3xs text-emerald-200 block uppercase font-bold">
                    {t('dashboard.estYield', 'Est. Yield')}
                  </span>
                  <span className="font-bold text-white mt-0.5 block">
                    {result.details?.estimatedYield || '4.0 - 5.2 t/ha'}
                  </span>
                </div>
              </div>
            </div>

            {/* Why This Crop? Section */}
            {(() => {
              const reasoning = getCropReasoning(result.cropKey);
              return (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t('ai.result.whyTitle', 'Why was this crop recommended?')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {reasoning.why}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Important Soil Factors */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                      <h5 className="text-xs font-bold text-amber-950 flex items-center gap-1.5 uppercase tracking-wide mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{t('ai.result.soilFactorsTitle', 'Important Soil Factors')}</span>
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {reasoning.soil}
                      </p>
                    </div>

                    {/* Weather Considerations */}
                    <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/70">
                      <h5 className="text-xs font-bold text-teal-950 flex items-center gap-1.5 uppercase tracking-wide mb-1.5">
                        <CloudSun className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{t('ai.result.weatherFactorsTitle', 'Weather Considerations')}</span>
                      </h5>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {reasoning.weather}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Next Steps */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <h5 className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-2 mb-2">
                      <ListChecks className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{t('ai.result.nextStepsTitle', 'Suggested Next Steps')}</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {reasoning.next}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Clear Disclaimer / AI Transparency */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 text-slate-500 text-3xs sm:text-2xs leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p>
                {t(
                  'ai.disclaimer',
                  'Mrittika AI is an artificial intelligence assistant providing decision support based on model analytics. Field conditions and local agronomy may vary.'
                )}
              </p>
            </div>

            {/* Reset / Test Another Button */}
            {onReset && (
              <div className="pt-2 flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onReset}
                  icon={RotateCcw}
                  className="w-full sm:w-auto"
                >
                  {t('prediction.testAnother', 'Test Another Soil Sample')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MrittikaAI;
