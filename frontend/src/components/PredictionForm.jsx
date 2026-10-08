import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { Sparkles, RotateCcw, AlertCircle, Info, Beaker, MapPin, Navigation, CloudSun } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const PredictionForm = ({ onSubmit, isLoading, errorMessage }) => {
  const { t } = useLanguage();

  // Mode: 'smart' (GPS + Soil) vs 'manual' (7 parameters)
  const [mode, setMode] = useState('smart');
  const [gpsStatus, setGpsStatus] = useState('');

  const [formData, setFormData] = useState({
    N: '90',
    P: '42',
    K: '43',
    ph: '6.5',
    latitude: '22.5726',
    longitude: '88.3639',
    temperature: '26.5',
    humidity: '82',
    rainfall: '202',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const PRESET_SAMPLES = [
    {
      name: 'Monsoon Paddy (Rice / ধান / धान)',
      values: { N: 90, P: 42, K: 43, ph: 6.5, latitude: 22.5726, longitude: 88.3639, temperature: 26.5, humidity: 82, rainfall: 210 },
    },
    {
      name: 'Warm Loam (Maize / ভুট্টা / मक्का)',
      values: { N: 70, P: 48, K: 40, ph: 6.2, latitude: 23.2324, longitude: 87.8615, temperature: 24.5, humidity: 65, rainfall: 95 },
    },
    {
      name: 'Alluvial Basin (Jute / পাট / पटसन)',
      values: { N: 78, P: 39, K: 40, ph: 6.8, latitude: 22.9042, longitude: 88.3970, temperature: 25.1, humidity: 79, rainfall: 175 },
    },
    {
      name: 'Potash Rich (Banana / কলা / केला)',
      values: { N: 100, P: 75, K: 180, ph: 6.3, latitude: 23.4710, longitude: 88.5565, temperature: 27.0, humidity: 80, rainfall: 120 },
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by this browser.');
      return;
    }

    setGpsStatus('Detecting your GPS location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        setFormData((prev) => ({
          ...prev,
          latitude: String(lat),
          longitude: String(lon),
        }));
        setGpsStatus(`📍 GPS detected: ${lat}, ${lon}`);
        setTimeout(() => setGpsStatus(''), 4000);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setGpsStatus('Unable to access GPS. Using default coordinates.');
        setTimeout(() => setGpsStatus(''), 4000);
      },
      { timeout: 8000 }
    );
  };

  const applyPreset = (preset) => {
    setFormData(Object.fromEntries(Object.entries(preset.values).map(([k, v]) => [k, String(v)])));
    setFieldErrors({});
  };

  const handleReset = () => {
    setFormData({
      N: '',
      P: '',
      K: '',
      ph: '',
      latitude: '22.5726',
      longitude: '88.3639',
      temperature: '',
      humidity: '',
      rainfall: '',
    });
    setFieldErrors({});
    setGpsStatus('');
  };

  const validate = () => {
    const errors = {};
    const n = parseFloat(formData.N);
    const p = parseFloat(formData.P);
    const k = parseFloat(formData.K);
    const ph = parseFloat(formData.ph);

    if (isNaN(n) || n < 0 || n > 1000) errors.N = '0 - 1000 kg/ha';
    if (isNaN(p) || p < 0 || p > 1000) errors.P = '0 - 1000 kg/ha';
    if (isNaN(k) || k < 0 || k > 1000) errors.K = '0 - 1000 kg/ha';
    if (isNaN(ph) || ph < 0 || ph > 14) errors.ph = '0 - 14 pH';

    if (mode === 'smart') {
      const lat = parseFloat(formData.latitude);
      const lon = parseFloat(formData.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) errors.latitude = '-90 to 90';
      if (isNaN(lon) || lon < -180 || lon > 180) errors.longitude = '-180 to 180';
    } else {
      const temp = parseFloat(formData.temperature);
      const hum = parseFloat(formData.humidity);
      const rain = parseFloat(formData.rainfall);
      if (isNaN(temp) || temp < -50 || temp > 60) errors.temperature = '-50 to 60°C';
      if (isNaN(hum) || hum < 0 || hum > 100) errors.humidity = '0 - 100%';
      if (isNaN(rain) || rain < 0) errors.rainfall = '>= 0 mm';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        isSmart: mode === 'smart',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200/80">
        <button
          type="button"
          onClick={() => setMode('smart')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            mode === 'smart'
              ? 'bg-white text-emerald-800 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>🌾 Smart AI Recommendation (GPS + Soil)</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            mode === 'manual'
              ? 'bg-white text-emerald-800 shadow-sm shadow-slate-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CloudSun className="w-4 h-4 text-teal-600 shrink-0" />
          <span>🧪 Manual Weather & Soil Mode</span>
        </button>
      </div>

      {/* Quick preset selector */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('prediction.demoPresets', 'Quick Demo Presets:')}</span>
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('prediction.clearForm', 'Clear Form')}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESET_SAMPLES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all text-slate-700 shadow-2xs"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-rose-900">
              {t('prediction.errorTitle', 'Prediction Error')}
            </h5>
            <p className="text-xs mt-0.5 text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Section 1: Soil Macro-Nutrients & pH */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
          <Beaker className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Soil Chemical Nutrients (N-P-K & pH)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label={t('prediction.nitrogenLabel', 'Nitrogen (N)')}
            name="N"
            type="number"
            step="any"
            unit="kg/ha"
            placeholder="e.g. 90"
            value={formData.N}
            onChange={handleChange}
            error={fieldErrors.N}
            helperText="Soil Nitrogen level (0-1000)"
            required
          />
          <Input
            label={t('prediction.phosphorusLabel', 'Phosphorus (P)')}
            name="P"
            type="number"
            step="any"
            unit="kg/ha"
            placeholder="e.g. 42"
            value={formData.P}
            onChange={handleChange}
            error={fieldErrors.P}
            helperText="Soil Phosphorus level (0-1000)"
            required
          />
          <Input
            label={t('prediction.potassiumLabel', 'Potassium (K)')}
            name="K"
            type="number"
            step="any"
            unit="kg/ha"
            placeholder="e.g. 43"
            value={formData.K}
            onChange={handleChange}
            error={fieldErrors.K}
            helperText="Soil Potassium level (0-1000)"
            required
          />
          <Input
            label={t('prediction.phLabel', 'Soil pH')}
            name="ph"
            type="number"
            step="0.1"
            unit="pH"
            placeholder="e.g. 6.5"
            value={formData.ph}
            onChange={handleChange}
            error={fieldErrors.ph}
            helperText="pH index (0.0 - 14.0)"
            required
          />
        </div>
      </div>

      {/* Section 2: Location (Smart Mode) OR Weather (Manual Mode) */}
      {mode === 'smart' ? (
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 pb-1 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Farm Geographic Location (For Live Open-Meteo Weather)
              </h4>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all shadow-2xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Detect My GPS Coordinates</span>
            </button>
          </div>

          {gpsStatus && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
              {gpsStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Latitude (°)"
              name="latitude"
              type="number"
              step="any"
              unit="°N/S"
              placeholder="e.g. 22.5726"
              value={formData.latitude}
              onChange={handleChange}
              error={fieldErrors.latitude}
              helperText="Degrees (-90 to 90)"
              required
            />
            <Input
              label="Longitude (°)"
              name="longitude"
              type="number"
              step="any"
              unit="°E/W"
              placeholder="e.g. 88.3639"
              value={formData.longitude}
              onChange={handleChange}
              error={fieldErrors.longitude}
              helperText="Degrees (-180 to 180)"
              required
            />
          </div>
          <p className="mt-2 text-2xs text-slate-500">
            🌦️ Weather data (temperature, relative humidity, and precipitation) will be retrieved automatically from Open-Meteo API using these coordinates.
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
            <Info className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Manual Environmental Telemetry
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label={t('prediction.tempLabel', 'Temperature')}
              name="temperature"
              type="number"
              step="any"
              unit="°C"
              placeholder="e.g. 26.5"
              value={formData.temperature}
              onChange={handleChange}
              error={fieldErrors.temperature}
              helperText="-50°C to 60°C"
              required
            />
            <Input
              label={t('prediction.humidityLabel', 'Humidity')}
              name="humidity"
              type="number"
              step="any"
              unit="%"
              placeholder="e.g. 82"
              value={formData.humidity}
              onChange={handleChange}
              error={fieldErrors.humidity}
              helperText="0% to 100%"
              required
            />
            <Input
              label={t('prediction.rainfallLabel', 'Rainfall')}
              name="rainfall"
              type="number"
              step="any"
              unit="mm"
              placeholder="e.g. 202"
              value={formData.rainfall}
              onChange={handleChange}
              error={fieldErrors.rainfall}
              helperText="Seasonal precipitation in mm"
              required
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          icon={Sparkles}
          className="w-full text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 py-3.5"
        >
          {mode === 'smart'
            ? '🌾 Fetch Live Weather & Predict Best Crop'
            : '🧪 Predict Crop with Manual Inputs'}
        </Button>
        <p className="text-center text-xs text-slate-500 mt-2 px-2">
          {t(
            'prediction.backedByML',
            'Backed by Machine Learning trained on multi-regional agro-climatic datasets'
          )}
        </p>
      </div>
    </form>
  );
};

export default PredictionForm;
