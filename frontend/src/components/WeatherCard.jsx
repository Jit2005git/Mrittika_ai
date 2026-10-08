import React from 'react';
import { Thermometer, Droplets, CloudRain, MapPin, Sun, RefreshCw } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const WeatherCard = ({
  weather,
  compact = false,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const { t } = useLanguage();

  if (!weather) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-lg shadow-emerald-900/10 ${className}`}
    >
      {/* Decorative background glows */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-teal-300/15 blur-2xl pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        {/* Header: Location & Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-emerald-100 text-3xs sm:text-xs font-semibold uppercase tracking-wider truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-200" />
              <span className="truncate">{weather.location || 'Your Farm Region'}</span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold text-white mt-1">
              {t('weather.liveFarmClimate', 'Live Farm Climate')}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-3xs font-medium bg-emerald-500/30 border border-emerald-400/30 text-emerald-100 backdrop-blur-sm">
              {t('weather.liveTelemetry', 'Live')}
            </span>
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={isRefreshing}
                title={t('common.refresh', 'Refresh')}
                aria-label="Refresh live weather"
                className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-100 transition-colors focus:outline-none"
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Big Temperature & Condition */}
        <div className="mt-5 flex items-baseline justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight">{weather.temperature}</span>
              <span className="text-xl sm:text-2xl font-light text-emerald-200">°C</span>
            </div>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium mt-1">
              {weather.condition || 'Partly Cloudy'}{' '}
              {weather.feelsLike ? `• ${weather.feelsLike}°C` : ''}
            </p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 shrink-0">
            <Sun className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
          </div>
        </div>

        {/* Primary Metrics: Temperature, Humidity, Rainfall */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-2.5 pt-4 border-t border-emerald-500/40">
          <div className="bg-emerald-800/40 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-emerald-400/15">
            <div className="flex items-center gap-1 text-emerald-200 text-3xs sm:text-xs font-medium">
              <Thermometer className="w-3 h-3 shrink-0" />
              <span className="truncate">{t('weather.temperature', 'Temp')}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white mt-1">{weather.temperature}°C</p>
          </div>

          <div className="bg-emerald-800/40 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-emerald-400/15">
            <div className="flex items-center gap-1 text-emerald-200 text-3xs sm:text-xs font-medium">
              <Droplets className="w-3 h-3 shrink-0" />
              <span className="truncate">{t('weather.humidity', 'Humidity')}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white mt-1">{weather.humidity}%</p>
          </div>

          <div className="bg-emerald-800/40 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-emerald-400/15">
            <div className="flex items-center gap-1 text-emerald-200 text-3xs sm:text-xs font-medium">
              <CloudRain className="w-3 h-3 shrink-0" />
              <span className="truncate">{t('weather.rainfall', 'Rainfall')}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white mt-1">{weather.rainfall} mm</p>
          </div>
        </div>

        {/* Detailed summary if not compact */}
        {!compact && weather.summary && (
          <div className="mt-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm text-2xs sm:text-xs text-emerald-50 border border-white/10 leading-relaxed">
            <strong className="font-semibold text-emerald-200 block mb-0.5">
              {t('weather.agronomicSummary', 'Agronomic Note:')}
            </strong>
            {weather.summary}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
