import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, SUPPORTED_LANGUAGES } from './translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'mrittika_language';
const DEFAULT_LANGUAGE = 'en';

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((langCode) => {
    if (translations[langCode]) {
      setLanguageState(langCode);
      try {
        localStorage.setItem(STORAGE_KEY, langCode);
        document.documentElement.lang = langCode;
      } catch (e) {
        console.warn('Could not save language to localStorage:', e);
      }
    } else {
      console.warn(`Unsupported language code: ${langCode}`);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  /**
   * Safe nested key lookup (e.g. t('nav.dashboard'))
   * Falls back to English if key is missing in active language, then to fallback or key itself.
   */
  const t = useCallback((keyPath, fallback = '') => {
    if (!keyPath) return fallback;

    const resolveKey = (obj, path) => {
      const parts = path.split('.');
      let current = obj;
      for (const part of parts) {
        if (current === undefined || current === null) return undefined;
        current = current[part];
      }
      return current;
    };

    const activeTranslation = resolveKey(translations[language], keyPath);
    if (activeTranslation !== undefined && activeTranslation !== null) {
      return activeTranslation;
    }

    // Fallback to English
    const englishFallback = resolveKey(translations[DEFAULT_LANGUAGE], keyPath);
    if (englishFallback !== undefined && englishFallback !== null) {
      return englishFallback;
    }

    return fallback || keyPath;
  }, [language]);

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
        currentLanguageMeta,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
