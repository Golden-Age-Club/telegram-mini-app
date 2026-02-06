import api from './axios';

/**
 * Translates text using the backend translation API.
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code (e.g., 'zh', 'vi').
 * @returns {Promise<{original: string, translated: string, lang: string}>} The translation result.
 */
export const translateText = async (text, targetLang) => {
  try {
    const response = await api.post('/api/translate', { text, targetLang });
    return response;
  } catch (error) {
    console.error('Translation API error:', error);
    throw error;
  }
};
