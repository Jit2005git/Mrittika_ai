import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  CloudSun,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import WeatherCard from '../components/WeatherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MrittikaAIGreeting from '../components/MrittikaAIGreeting';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { dashboardApi, weatherApi } from '../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState(false);

  const fetchDashboard = async () => {
    try {
      const data = await dashboardApi.getOverview();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefreshWeather = async () => {
    setIsRefreshingWeather(true);
    try {
      const refreshed = await weatherApi.getWeather();
      setDashboardData((prev) => ({
        ...prev,
        weather: refreshed,
      }));
    } finally {
      setTimeout(() => setIsRefreshingWeather(false), 400);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text={t('common.loading', 'Loading your agricultural intelligence...')} />
      </div>
    );
  }

  const { weather, soil, alerts, recentPredictions } = dashboardData;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. Mrittika AI Friendly Assistant Greeting Section */}
      <MrittikaAIGreeting weather={weather} soil={soil} />

      {/* 2. Welcome Message & Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-950/10">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-100 text-3xs sm:text-xs font-semibold backdrop-blur-sm mb-2.5 sm:mb-3">
              <Sprout className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span>{t('app.tagline', 'Mrittika Farm Intelligence Platform')}</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {t('dashboard.greeting', 'Namaste')}, {user?.name || t('dashboard.kisanMitra', 'Kisan Mitra')}! 👋
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-base text-emerald-100 max-w-xl leading-relaxed">
              {t(
                'dashboard.climateOptimalNotice',
                'Your field parameters are currently optimal. Monsoonal soil moisture levels are favorable for Kharif crop nourishment.'
              )}
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <Link to="/crop-prediction" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 shadow-md font-bold text-xs sm:text-sm"
              >
                {t('dashboard.newPredictionBtn', 'New Prediction')}
              </Button>
            </Link>
            <Link to="/weather" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                icon={CloudSun}
                className="w-full sm:w-auto bg-emerald-900/40 text-white border-emerald-400/40 hover:bg-emerald-900/60 text-xs sm:text-sm"
              >
                {t('dashboard.fullForecastBtn', 'Full Forecast')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Top Grid: Live Weather + Crop Recommendation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Weather Card (5 cols on desktop, full width on mobile) */}
        <div className="lg:col-span-5">
          <WeatherCard
            weather={weather}
            onRefresh={handleRefreshWeather}
            isRefreshing={isRefreshingWeather}
          />
        </div>

        {/* Current Active Crop Recommendation Card (7 cols on desktop) */}
        <div className="lg:col-span-7">
          <Card
            title={t('dashboard.featuredCropTitle', 'Featured Crop Recommendation')}
            subtitle={t('dashboard.featuredCropSubtitle', 'Calculated from recent soil lab test & regional climate')}
            badge={t('common.optimal', 'Recommended')}
            icon={Sprout}
            className="h-full flex flex-col justify-between"
            action={
              <Link
                to="/crop-prediction"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
              >
                <span>{t('dashboard.newTestLink', 'Run New Analysis')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="space-y-4">
              <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-100">
                <div>
                  <span className="text-3xs sm:text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    {t('dashboard.highestSuitability', 'Highest Agronomic Suitability')}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    Rice (Aman Paddy / ধান / चावल)
                  </h3>
                  <p className="text-xs text-slate-500 italic font-serif">Oryza sativa • Kharif Staple</p>
                </div>
                <div className="xs:text-right bg-emerald-50/50 p-2 sm:p-0 rounded-xl xs:bg-transparent">
                  <span className="text-2xl font-extrabold text-emerald-600">94.8%</span>
                  <p className="text-3xs uppercase tracking-wider text-slate-400 font-bold">
                    {t('dashboard.suitabilityScore', 'Suitability Score')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-3xs uppercase font-bold text-slate-400 block truncate">
                    {t('dashboard.growthCycle', 'Growth Cycle')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">120 - 135 Days</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-3xs uppercase font-bold text-slate-400 block truncate">
                    {t('dashboard.waterNeed', 'Water Need')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">Flooded</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-3xs uppercase font-bold text-slate-400 block truncate">
                    {t('dashboard.estYield', 'Est. Yield')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">4.8 t/ha</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-3xs uppercase font-bold text-slate-400 block truncate">
                    {t('dashboard.soilMatch', 'Soil Match')}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">Clay Loam</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 leading-relaxed">
                💡 <strong className="text-emerald-900">{t('dashboard.insightNote')}</strong>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Middle Grid: Soil Information Card + Alerts/Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Soil Information Card (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title={t('dashboard.soilProfileTitle', 'Soil Health Profile')}
            subtitle={t('dashboard.soilProfileSubtitle', 'Gangetic Alluvial Basin • Sample Test #S-2026-88')}
            icon={Layers}
            badge={soil.pHClassification}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.soilTexture', 'Soil Texture')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 block">
                  {soil.texture}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.soilPH', 'Soil pH')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-1 block">
                  {soil.pHLevel} ({t('common.optimal', 'Optimal')})
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.organicCarbon', 'Organic Carbon')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 block">
                  {soil.organicCarbon}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.nitrogen', 'Nitrogen (N)')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 block">
                  {soil.nitrogenStatus}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.phosphorus', 'Phosphorus (P)')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 block">
                  {soil.phosphorusStatus}
                </span>
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block truncate">
                  {t('dashboard.potassium', 'Potassium (K)')}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 mt-1 block">
                  {soil.potassiumStatus}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col xs:flex-row xs:items-center justify-between gap-2 text-3xs sm:text-xs text-slate-500">
              <span>
                {t('dashboard.conductivity', 'Electrical Conductivity')}: <strong>{soil.electricalConductivity}</strong>
              </span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('dashboard.balanced', 'Balanced')}</span>
              </span>
            </div>
          </Card>
        </div>

        {/* Alerts & Warnings Card (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title={t('dashboard.advisoriesTitle', 'Advisories & Alerts')}
            subtitle={t('dashboard.advisoriesSubtitle', 'Automated agro-climatic notifications')}
            icon={AlertTriangle}
          >
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all ${
                    alert.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : alert.type === 'success'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-blue-50/70 border-blue-200 text-blue-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {alert.type === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span>{alert.title}</span>
                    </span>
                    <span className="text-3xs opacity-75 shrink-0 ml-2">{alert.time}</span>
                  </div>
                  <p className="opacity-90 leading-relaxed text-3xs sm:text-xs">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Bottom Section: Recent Predictions & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Recent Predictions Table (8 cols) - fully responsive with scroll container */}
        <div className="lg:col-span-8">
          <Card
            title={t('dashboard.recentPredTitle', 'Recent Soil Predictions')}
            subtitle={t('dashboard.recentPredSubtitle', 'History of agronomic crop evaluations')}
            icon={Clock}
            action={
              <Link
                to="/crop-prediction"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>{t('dashboard.newTestLink', 'New Test')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-3xs">
                    <th className="pb-3">{t('dashboard.colDate', 'Date')}</th>
                    <th className="pb-3">{t('dashboard.colCrop', 'Recommended Crop')}</th>
                    <th className="pb-3">{t('dashboard.colNPK', 'NPK Ratio')}</th>
                    <th className="pb-3">{t('dashboard.colConfidence', 'Confidence')}</th>
                    <th className="pb-3 text-right">{t('dashboard.colStatus', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentPredictions.map((pred) => (
                    <tr key={pred.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 text-slate-500 whitespace-nowrap">{pred.date}</td>
                      <td className="py-3 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{pred.crop}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 whitespace-nowrap">
                        {pred.params.N}:{pred.params.P}:{pred.params.K}
                      </td>
                      <td className="py-3 font-semibold text-emerald-600 whitespace-nowrap">
                        {pred.confidence}
                      </td>
                      <td className="py-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-emerald-100 text-emerald-800">
                          {pred.suitability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Action Navigation Grid (4 cols) */}
        <div className="lg:col-span-4">
          <Card
            title={t('dashboard.quickActionsTitle', 'Quick Actions')}
            subtitle={t('dashboard.quickActionsSubtitle', 'Frequently used workflows')}
            icon={Sparkles}
          >
            <div className="grid grid-cols-1 gap-2.5">
              <Link
                to="/crop-prediction"
                className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {t('dashboard.runCropPredictor', 'Run Crop Predictor')}
                    </h5>
                    <p className="text-3xs text-slate-500 truncate">
                      {t('dashboard.runCropPredictorSub', 'Test N, P, K & pH values')}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>

              <Link
                to="/weather"
                className="p-3 rounded-xl border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {t('dashboard.weatherForecast', 'Weather Forecast')}
                    </h5>
                    <p className="text-3xs text-slate-500 truncate">
                      {t('dashboard.weatherForecastSub', 'Check rain & moisture')}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>

              <Link
                to="/profile"
                className="p-3 rounded-xl border border-slate-200/80 hover:border-amber-500 hover:bg-amber-50/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-slate-800 truncate">
                      {t('dashboard.farmSettings', 'Farm & Profile Settings')}
                    </h5>
                    <p className="text-3xs text-slate-500 truncate">
                      {t('dashboard.farmSettingsSub', 'Language, farm plot size')}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
