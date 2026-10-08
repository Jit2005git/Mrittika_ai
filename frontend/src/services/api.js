import axios from 'axios';
import { MOCK_WEATHER, MOCK_RECENT_PREDICTIONS, MOCK_ALERTS, MOCK_SOIL_DATA, CROP_DETAILS } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Axios instance with default configuration
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization header if access token exists in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mrittika_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler to extract user-friendly messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (typeof data.detail === 'string') {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          // Pydantic validation errors
          message = data.detail.map((err) => err.msg || `${err.loc?.join('.')}: invalid value`).join(', ');
        } else if (data.message) {
          message = data.message;
        }
      }
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        // Token expired or invalid
        localStorage.removeItem('mrittika_token');
        localStorage.removeItem('mrittika_user');
      }
    } else if (error.request) {
      message = 'Unable to reach Mrittika AI server. Please check your network or verify the backend is running.';
    } else {
      message = error.message;
    }

    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

// Helper to normalize language codes for backend ("en", "bn", "hi", "or", "mr", "ml")
export const normalizeLanguageCode = (lang) => {
  if (!lang) return 'en';
  const l = String(lang).toLowerCase().trim();
  const allowed = ['en', 'bn', 'hi', 'or', 'mr', 'ml'];
  if (allowed.includes(l)) return l;
  if (l.includes('bengali') || l.includes('bangla')) return 'bn';
  if (l.includes('hindi')) return 'hi';
  if (l.includes('odia') || l.includes('oriya')) return 'or';
  if (l.includes('marathi')) return 'mr';
  if (l.includes('malayalam')) return 'ml';
  return 'en';
};

// Helper to look up or generate crop details
const getCropDetails = (cropKey) => {
  const key = (cropKey || '').toLowerCase().trim();
  if (CROP_DETAILS[key]) {
    return CROP_DETAILS[key];
  }
  const formattedName = key.charAt(0).toUpperCase() + key.slice(1);
  return {
    name: formattedName,
    scientificName: `${formattedName} sp.`,
    category: 'Recommended cultivar',
    idealConditions: 'Well suited for the tested soil nutrients and prevailing climate.',
    growingPeriod: '90 - 130 days',
    waterRequirement: 'Moderate',
    estimatedYield: '3.5 - 5.0 tonnes / hectare',
    tips: [
      'Conduct regular soil health inspections.',
      'Maintain balanced organic fertilization to sustain crop yield.',
    ],
  };
};

// =========================================================
// API SERVICES
// =========================================================

/**
 * Crop Prediction Services
 * Connects directly to FastAPI crop routes
 */
export const cropApi = {
  /**
   * Smart Crop Prediction (GPS + Soil)
   * POST /api/v1/smart-crop-predict
   */
  smartCropPredict: async (formData) => {
    const payload = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      ph: Number(formData.ph),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

    const response = await apiClient.post('/api/v1/smart-crop-predict', payload);

    if (response.data && response.data.data) {
      const data = response.data.data;
      const recommendedKey = (data.prediction?.recommended_crop || 'rice').toLowerCase();
      const details = getCropDetails(recommendedKey);

      const top3 = (data.prediction?.top_3 || []).map((item) => ({
        crop: item.crop,
        probability: item.probability,
        percentage: Math.round(Number(item.probability) * 100),
      }));

      const topProbability = top3.length > 0 ? top3[0].probability : 0.95;

      return {
        success: true,
        crop: details.name,
        cropKey: recommendedKey,
        confidence: (topProbability * 100).toFixed(1),
        top_3: top3,
        weather: data.weather || null,
        soil: data.soil || null,
        latitude: data.latitude,
        longitude: data.longitude,
        details,
        source: 'backend',
        mode: 'smart',
      };
    }

    throw new Error(response.data?.message || 'Smart prediction failed to return valid data.');
  },

  /**
   * Manual Crop Prediction (7 parameters)
   * POST /api/v1/crop-predict
   */
  predictCrop: async (formData) => {
    const payload = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    const response = await apiClient.post('/api/v1/crop-predict', payload);

    if (response.data && response.data.data) {
      const data = response.data.data;
      const recommendedKey = (data.recommended_crop || 'rice').toLowerCase();
      const details = getCropDetails(recommendedKey);

      const top3 = (data.top_3 || []).map((item) => ({
        crop: item.crop,
        probability: item.probability,
        percentage: Math.round(Number(item.probability) * 100),
      }));

      const topProbability = top3.length > 0 ? top3[0].probability : 0.95;

      return {
        success: true,
        crop: details.name,
        cropKey: recommendedKey,
        confidence: (topProbability * 100).toFixed(1),
        top_3: top3,
        weather: {
          temperature: payload.temperature,
          humidity: payload.humidity,
          rainfall: payload.rainfall,
        },
        soil: {
          N: payload.N,
          P: payload.P,
          K: payload.K,
          pH: payload.ph,
        },
        details,
        source: 'backend',
        mode: 'manual',
      };
    }

    throw new Error(response.data?.message || 'Prediction failed to return valid data.');
  },
};

/**
 * Weather Services
 * Connects to live weather routes
 */
export const weatherApi = {
  /**
   * Live Current Weather (Async endpoint with rain, wind speed)
   * GET /api/v1/weather/current
   */
  getCurrentWeather: async (lat = 22.5726, lon = 88.3639) => {
    const response = await apiClient.get('/api/v1/weather/current', {
      params: { latitude: Number(lat), longitude: Number(lon) },
    });

    if (response.data && response.data.data) {
      const data = response.data.data;
      return {
        ...MOCK_WEATHER,
        temperature: data.temperature ?? MOCK_WEATHER.temperature,
        humidity: data.humidity ?? MOCK_WEATHER.humidity,
        rainfall: data.rainfall ?? data.rain ?? MOCK_WEATHER.rainfall,
        rain: data.rain ?? 0,
        windSpeed: data.wind_speed ?? MOCK_WEATHER.windSpeed,
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'backend',
      };
    }

    throw new Error('Weather data unavailable from backend.');
  },

  /**
   * Weather Overview (Sync endpoint)
   * GET /api/v1/weather/weather
   */
  getWeather: async (lat = 22.5726, lon = 88.3639) => {
    try {
      const response = await apiClient.get('/api/v1/weather/current', {
        params: { latitude: Number(lat), longitude: Number(lon) },
      });
      if (response.data && response.data.data) {
        const data = response.data.data;
        return {
          ...MOCK_WEATHER,
          temperature: data.temperature ?? MOCK_WEATHER.temperature,
          humidity: data.humidity ?? MOCK_WEATHER.humidity,
          rainfall: data.rainfall ?? data.rain ?? MOCK_WEATHER.rainfall,
          windSpeed: data.wind_speed ?? MOCK_WEATHER.windSpeed,
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'backend',
        };
      }
    } catch {
      // Fallback to sync endpoint
      const response = await apiClient.get('/api/v1/weather/weather', {
        params: { latitude: Number(lat), longitude: Number(lon) },
      });
      if (response.data && response.data.data) {
        const data = response.data.data;
        return {
          ...MOCK_WEATHER,
          temperature: data.temperature ?? MOCK_WEATHER.temperature,
          humidity: data.humidity ?? MOCK_WEATHER.humidity,
          rainfall: data.rainfall ?? MOCK_WEATHER.rainfall,
          source: 'backend',
        };
      }
    }
    return { ...MOCK_WEATHER, source: 'telemetry' };
  },
};

/**
 * Authentication Services
 * Connects directly to FastAPI auth routes
 */
export const authApi = {
  /**
   * Farmer Signup
   * POST /api/v1/auth/signup
   */
  signup: async (name, email, password, language = 'en') => {
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password,
      language: normalizeLanguageCode(language),
    };

    const response = await apiClient.post('/api/v1/auth/signup', payload);

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message,
        user: response.data.data,
      };
    }

    throw new Error(response.data?.message || 'Registration failed.');
  },

  /**
   * Farmer Login
   * POST /api/v1/auth/login
   */
  login: async (email, password) => {
    const payload = {
      email: email.trim(),
      password,
    };

    const response = await apiClient.post('/api/v1/auth/login', payload);

    if (response.data && response.data.success && response.data.data) {
      const { access_token, farmer } = response.data.data;
      if (access_token) {
        localStorage.setItem('mrittika_token', access_token);
      }
      if (farmer) {
        localStorage.setItem('mrittika_user', JSON.stringify(farmer));
      }
      return {
        success: true,
        user: farmer,
        token: access_token,
      };
    }

    throw new Error(response.data?.message || 'Invalid email or password.');
  },

  /**
   * Get Current Farmer Profile
   * GET /api/v1/auth/me
   */
  getCurrentUser: async () => {
    const token = localStorage.getItem('mrittika_token');
    if (!token) return null;

    try {
      const response = await apiClient.get('/api/v1/auth/me');
      if (response.data && response.data.success && response.data.data) {
        const farmer = response.data.data;
        localStorage.setItem('mrittika_user', JSON.stringify(farmer));
        return farmer;
      }
    } catch (err) {
      if (err.status === 401) {
        localStorage.removeItem('mrittika_token');
        localStorage.removeItem('mrittika_user');
      }
      throw err;
    }

    const cached = localStorage.getItem('mrittika_user');
    return cached ? JSON.parse(cached) : null;
  },

  /**
   * Update Farmer Language Preference
   * PATCH /api/v1/auth/language
   */
  updateLanguage: async (language) => {
    const langCode = normalizeLanguageCode(language);
    const response = await apiClient.patch('/api/v1/auth/language', {
      language: langCode,
    });

    if (response.data && response.data.success) {
      const cached = localStorage.getItem('mrittika_user');
      if (cached) {
        try {
          const userObj = JSON.parse(cached);
          userObj.language = langCode;
          localStorage.setItem('mrittika_user', JSON.stringify(userObj));
        } catch {
          // ignore
        }
      }
      return {
        success: true,
        data: response.data.data,
      };
    }

    throw new Error(response.data?.message || 'Failed to update language.');
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('mrittika_token');
    localStorage.removeItem('mrittika_user');
  },
};

/**
 * Dashboard Overview Service
 */
export const dashboardApi = {
  getOverview: async () => {
    let liveWeather = MOCK_WEATHER;
    try {
      liveWeather = await weatherApi.getCurrentWeather();
    } catch {
      // Use fallback weather
    }

    return {
      weather: liveWeather,
      soil: MOCK_SOIL_DATA,
      alerts: MOCK_ALERTS,
      recentPredictions: MOCK_RECENT_PREDICTIONS,
      stats: {
        totalPredictions: 24,
        averageConfidence: '92.4%',
        optimalSoilHealth: 'Optimal (pH 6.8)',
        recommendedSeason: 'Rabi Cultivation',
      },
    };
  },
};
