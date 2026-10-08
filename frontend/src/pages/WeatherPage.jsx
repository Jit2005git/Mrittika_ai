import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  CloudSun,
  CloudLightning,
  RefreshCw,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import { weatherApi } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const REGIONAL_LOCATIONS = [
  { name: 'Kolkata (Gangetic Plain)', lat: 22.5726, lon: 88.3639 },
  { name: 'Burdwan (Rice Bowl)', lat: 23.2324, lon: 87.8615 },
  { name: 'Hooghly (Alluvial Belt)', lat: 22.9042, lon: 88.3970 },
  { name: 'Nadia (Vegetable & Jute)', lat: 23.4710, lon: 88.5565 },
];

export const WeatherPage = () => {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState(REGIONAL_LOCATIONS[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = async (loc = selectedLocation) => {
    try {
      const data = await weatherApi.getWeather(loc.lat, loc.lon);
      setWeatherData({ ...data, location: loc.name });
    } catch (err) {
      console.error('Failed to load weather:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setRefreshing(true);
  };

  const getForecastIcon = (iconName) => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />;
      case 'cloud-lightning':
        return <CloudLightning className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />;
      case 'sun':
        return <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />;
      default:
        return <CloudSun className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loading', 'Retrieving meteorological telemetry...')} />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-6xl w-full mx-auto">
      {/* Header & Location Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('weather.title', 'Agricultural Weather Telemetry')}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            {t('weather.subtitle', 'Real-time atmospheric readings and 7-day crop-climate forecast')}
          </p>
        </div>

        {/* Location Pills + Refresh button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {REGIONAL_LOCATIONS.map((loc) => (
            <button
              key={loc.name}
              type="button"
              onClick={() => handleLocationChange(loc)}
              className={`text-3xs sm:text-xs font-semibold px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                selectedLocation.name === loc.name
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {loc.name.split(' ')[0]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              loadWeather(selectedLocation);
            }}
            disabled={refreshing}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors shrink-0"
            title={t('common.refresh', 'Refresh')}
            aria-label="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Current Weather Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 text-white p-5 sm:p-8 lg:p-10 shadow-xl shadow-emerald-950/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top metadata */}
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-100 text-3xs sm:text-xs font-bold tracking-wider uppercase truncate">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
              <span className="truncate">{weatherData.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xs sm:text-2xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-100">
                Lat: {selectedLocation.lat} • Lon: {selectedLocation.lon}
              </span>
            </div>
          </div>

          {/* Big Temperature & Summary */}
          <div className="mt-6 sm:mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
            <div className="flex items-baseline gap-3 sm:gap-4">
              <span className="text-5xl sm:text-7xl font-black tracking-tight">{weatherData.temperature}</span>
              <span className="text-2xl sm:text-3xl font-light text-emerald-200">°C</span>
              <div className="ml-2">
                <span className="text-lg sm:text-2xl font-bold block">{weatherData.condition}</span>
                <span className="text-3xs sm:text-xs text-emerald-200 block mt-0.5">
                  Feels like {weatherData.feelsLike}°C
                </span>
              </div>
            </div>

            {/* Weather Summary Box */}
            <div className="max-w-md p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs leading-relaxed text-emerald-50">
              <strong className="block text-emerald-200 font-bold mb-1 uppercase tracking-wider text-3xs sm:text-2xs">
                {t('weather.agronomicSummary', '🌾 Agronomic Weather Summary')}
              </strong>
              <p className="text-3xs sm:text-xs leading-relaxed">{weatherData.summary}</p>
            </div>
          </div>

          {/* 4 Essential Atmospheric Metrics */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-5 sm:pt-6 border-t border-emerald-500/30">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-200 text-3xs sm:text-xs font-medium">
                <Thermometer className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('weather.temperature', 'Temperature')}</span>
              </div>
              <p className="text-base sm:text-xl font-bold mt-1">{weatherData.temperature}°C</p>
              <p className="text-3xs text-emerald-300 mt-0.5 truncate">{t('common.optimal', 'Optimal')}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-200 text-3xs sm:text-xs font-medium">
                <Droplets className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('weather.humidity', 'Relative Humidity')}</span>
              </div>
              <p className="text-base sm:text-xl font-bold mt-1">{weatherData.humidity}%</p>
              <p className="text-3xs text-emerald-300 mt-0.5 truncate">{t('common.high', 'High Transpiration')}</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-200 text-3xs sm:text-xs font-medium">
                <CloudRain className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('weather.rainfall', 'Precipitation')}</span>
              </div>
              <p className="text-base sm:text-xl font-bold mt-1">{weatherData.rainfall} mm</p>
              <p className="text-3xs text-emerald-300 mt-0.5 truncate">24h Accumulated</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-900/40 backdrop-blur-sm border border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-200 text-3xs sm:text-xs font-medium">
                <Wind className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{t('weather.windSpeed', 'Wind Speed')}</span>
              </div>
              <p className="text-base sm:text-xl font-bold mt-1">{weatherData.windSpeed} km/h</p>
              <p className="text-3xs text-emerald-300 mt-0.5 truncate">South-Easterly</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast-Style Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 flex-wrap">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <span>{t('weather.forecastTitle', '7-Day Farm Outlook & Precipitation Probability')}</span>
          </h2>
          <span className="text-3xs sm:text-xs text-slate-500">{t('weather.forecastUpdated', 'Updated every 3 hours')}</span>
        </div>

        {/* Responsive grid for forecast */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {weatherData.forecast &&
            weatherData.forecast.map((day, idx) => (
              <div
                key={day.day}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-center transition-all ${
                  idx === 0
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <span className="text-3xs sm:text-xs font-bold text-slate-700 block truncate">{day.day}</span>
                <div className="my-2 sm:my-3 flex justify-center">{getForecastIcon(day.icon)}</div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900">{day.temp}°C</div>
                <p className="text-3xs text-slate-500 mt-0.5 truncate">{day.condition}</p>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-3xs sm:text-2xs font-bold text-teal-700">
                  <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-teal-500 shrink-0" />
                  <span>{day.rainProb}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Crop Weather Advisory Banner */}
      <Card
        title={t('weather.advisoryTitle', 'Field Operations Advisory')}
        subtitle={t('weather.advisorySubtitle', 'Recommended farming tasks aligned with upcoming weather')}
        icon={AlertCircle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs text-slate-600">
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="text-slate-900 font-bold block mb-1">
              🚜 {t('weather.agronomicSummary', 'Pesticide & Spraying Management')}
            </strong>
            <p className="text-3xs sm:text-xs leading-relaxed">{t('weather.sprayingAdvisory')}</p>
          </div>
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
            <strong className="text-slate-900 font-bold block mb-1">
              💧 {t('dashboard.waterNeed', 'Irrigation Timing')}
            </strong>
            <p className="text-3xs sm:text-xs leading-relaxed">{t('weather.irrigationAdvisory')}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherPage;
