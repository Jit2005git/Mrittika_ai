import React, { useState } from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import Card from '../components/Card';
import PredictionForm from '../components/PredictionForm';
import MrittikaAI from '../components/MrittikaAI';
import { cropApi } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

export const CropPredictionPage = () => {
  const { t } = useLanguage();
  const [aiState, setAiState] = useState('empty'); // 'empty' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);

  const handlePredict = async (formData) => {
    setAiState('loading');
    setErrorMessage('');
    try {
      let response;
      if (formData.isSmart !== false) {
        response = await cropApi.smartCropPredict(formData);
      } else {
        response = await cropApi.predictCrop(formData);
      }

      if (response && response.success) {
        setResult(response);
        setAiState('success');
      } else {
        setErrorMessage(
          t('ai.states.error', 'Unable to compute crop recommendation. Please verify parameter values.')
        );
        setAiState('error');
      }
    } catch (err) {
      console.error('Prediction failed:', err);
      setErrorMessage(
        err.message || t('ai.states.error', 'An error occurred during prediction.')
      );
      setAiState('error');
    }
  };

  const handleReset = () => {
    setResult(null);
    setErrorMessage('');
    setAiState('empty');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl w-full mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-3xs sm:text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{t('prediction.badge', 'Machine Learning Agro-Inference')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('prediction.title', 'Crop Suitability Prediction')}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          {t(
            'prediction.subtitle',
            'Input your soil chemistry test results and local meteorological data below. Our predictive model determines the crop variety that optimizes productivity for your specific land conditions.'
          )}
        </p>
      </div>

      {/* Main Grid: Form and AI Assistant Component */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Friendly Mrittika AI Assistant Card (handles Empty, Loading, Error, and Success) */}
        <MrittikaAI
          state={aiState}
          result={result}
          errorMessage={errorMessage}
          onReset={handleReset}
        />

        {/* Prediction Form Card */}
        <Card
          title="Agro-Chemical & Environmental Input Parameters"
          subtitle="Smart mode fetches live Open-Meteo weather by GPS; manual mode evaluates all 7 features."
          icon={Sparkles}
        >
          <PredictionForm
            onSubmit={handlePredict}
            isLoading={aiState === 'loading'}
            errorMessage={aiState === 'error' ? errorMessage : ''}
          />
        </Card>

        {/* Reference Guide Info Card */}
        <Card
          title={t('prediction.guidelinesTitle', 'Optimal Measurement Guidelines')}
          subtitle={t('prediction.guidelinesSubtitle', 'Recommended sampling procedures for accurate agro-prediction')}
          icon={HelpCircle}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 font-bold block mb-1">
                🌱 {t('prediction.nitrogenLabel', 'Soil Sampling (NPK)')}
              </strong>
              <p className="text-3xs sm:text-xs leading-relaxed">
                {t(
                  'prediction.samplingTip',
                  'Take composite core samples from 15-20 cm root depth across 5 points of your field. Dry in shade before lab evaluation.'
                )}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 font-bold block mb-1">
                ⚗️ {t('prediction.phLabel', 'Soil pH Precision')}
              </strong>
              <p className="text-3xs sm:text-xs leading-relaxed">
                {t(
                  'prediction.pHTip',
                  'Most arable crops flourish between 6.0 and 7.5. Acidic soils (<5.5) need agricultural lime, while alkaline (>8.0) need gypsum.'
                )}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <strong className="text-slate-900 font-bold block mb-1">
                🌧️ {t('prediction.rainfallLabel', 'Meteorological Data')}
              </strong>
              <p className="text-3xs sm:text-xs leading-relaxed">
                {t(
                  'prediction.metTip',
                  'Ensure temperature and rainfall figures reflect seasonal cumulative expectations for the targeted sowing period.'
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CropPredictionPage;
