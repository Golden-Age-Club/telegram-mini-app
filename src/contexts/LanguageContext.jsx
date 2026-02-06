import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText as translateService } from '../utils/translationService';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  /**
   * Translates text using the translation service.
   * @param {string} text - The text to translate.
   * @param {string} targetLang - The target language code (optional, defaults to current).
   * @returns {Promise<{original: string, translated: string, lang: string}>} The translation result.
   */
  const translateText = async (text, targetLang = null) => {
    const lang = targetLang || i18n.resolvedLanguage || i18n.language;
    
    try {
      const translated = await translateService(text, lang);
      return { original: text, translated, lang };
    } catch (error) {
      console.error('Translation error:', error);
      return { original: text, translated: text, error };
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' }
  ];

  return (
    <LanguageContext.Provider value={{
      currentLanguage: i18n.resolvedLanguage || i18n.language,
      changeLanguage,
      translateText,
      t,
      i18n,
      languages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
