import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import { Sparkles, RotateCcw, AlertCircle, Info, Beaker } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const PredictionForm = ({ onSubmit, isLoading, errorMessage }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    N: '90',
    P: '42',
    K: '43',
    temperature: '26.5',
    humidity: '82',
    ph: '6.5',
    rainfall: '202',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const PRESET_SAMPLES = [
    {
      name: 'Monsoon Paddy (Rice / ধান / धान)',
      values: { N: 90, P: 42, K: 43, temperature: 26.5, humidity: 82, ph: 6.5, rainfall: 210 },
    },
    {
      name: 'Warm Loam (Maize / ভুট্টা / मक्का)',
      values: { N: 70, P: 48, K: 40, temperature: 24.5, humidity: 65, ph: 6.2, rainfall: 95 },
    },
    {
      name: 'Alluvial Basin (Jute / পাট / पटसन)',
      values: { N: 78, P: 39, K: 40, temperature: 25.1, humidity: 79, ph: 6.8, rainfall: 175 },
    },
    {
      name: 'Potash Rich (Banana / কলা / केला)',
      values: { N: 100, P: 75, K: 180, temperature: 27.0, humidity: 80, ph: 6.3, rainfall: 120 },
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
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
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
    });
    setFieldErrors({});
  };

  const validate = () => {
    const errors = {};
    const n = parseFloat(formData.N);
    const p = parseFloat(formData.P);
    const k = parseFloat(formData.K);
    const temp = parseFloat(formData.temperature);
    const hum = parseFloat(formData.humidity);
    const ph = parseFloat(formData.ph);
    const rain = parseFloat(formData.rainfall);

    if (isNaN(n) || n < 0 || n > 200) errors.N = '0 - 200 kg/ha';
    if (isNaN(p) || p < 0 || p > 200) errors.P = '0 - 200 kg/ha';
    if (isNaN(k) || k < 0 || k > 250) errors.K = '0 - 250 kg/ha';
    if (isNaN(temp) || temp < 0 || temp > 55) errors.temperature = '0 - 55°C';
    if (isNaN(hum) || hum < 10 || hum > 100) errors.humidity = '10 - 100%';
    if (isNaN(ph) || ph < 3.0 || ph > 10.0) errors.ph = '3.0 - 10.0 pH';
    if (isNaN(rain) || rain < 0 || rain > 400) errors.rainfall = '0 - 400 mm';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick preset selector for instant testing */}
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

      {/* Section 1: Soil Macro-Nutrients */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
          <Beaker className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('prediction.nutrientsSection', 'Soil Chemical Nutrients (NPK)')}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            helperText={t('prediction.nitrogenHelper', 'Ratio in soil (0-140)')}
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
            helperText={t('prediction.phosphorusHelper', 'Ratio in soil (5-145)')}
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
            helperText={t('prediction.potassiumHelper', 'Ratio in soil (5-205)')}
            required
          />
        </div>
      </div>

      {/* Section 2: Environmental & Soil Climate Parameters */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
          <Info className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('prediction.envSection', 'Environmental & pH Parameters')}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            helperText={t('prediction.tempHelper', 'Ambient temp')}
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
            helperText={t('prediction.humidityHelper', 'Relative humidity')}
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
            helperText={t('prediction.phHelper', 'Optimal 5.5 - 7.5')}
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
            helperText={t('prediction.rainfallHelper', 'Average rainfall')}
            required
          />
        </div>
      </div>

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
          {t('prediction.submitBtn', 'Predict Optimal Crop Recommendation')}
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
