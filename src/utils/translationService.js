import { translate } from 'google-translate-api-browser';

// Cache for translations to minimize API calls
const getCache = () => {
  try {
    const cache = localStorage.getItem('translation_cache');
    return cache ? JSON.parse(cache) : {};
  } catch (e) {
    return {};
  }
};

const setCache = (cache) => {
  try {
    localStorage.setItem('translation_cache', JSON.stringify(cache));
  } catch (e) {
    // Ignore storage errors
  }
};

const translationCache = getCache();

// Queue system to prevent rate limiting
const queue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  
  while (queue.length > 0) {
    const { text, targetLang, resolve, reject } = queue.shift();
    
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache[cacheKey]) {
      resolve(translationCache[cacheKey]);
      continue;
    }

    try {
      let apiLang = targetLang;
      // Map language codes
      const langMap = {
        'zh': 'zh-CN',
        'fil': 'tl',
        'id': 'id',
        'ms': 'ms',
        'th': 'th',
        'vi': 'vi',
        'ar': 'ar',
        'ja': 'ja',
        'ko': 'ko'
      };
      
      if (langMap[targetLang]) {
        apiLang = langMap[targetLang];
      }

      // Try primary method: google-translate-api-browser
      // We explicitly set corsUrl to a reliable proxy to avoid "undefinedhttps" errors
      // caused by the library's default proxy handling.
      let translatedText = '';
      
      try {
        const result = await translate(text, { 
          to: apiLang,
          // Use a public CORS proxy that supports raw requests
          corsUrl: "https://api.allorigins.win/raw?url="
        });
        translatedText = result.text;
      } catch (primaryError) {
        console.warn('Primary translation failed, trying fallback...', primaryError);
        
        // Fallback: Direct fetch via allow-origin proxy
        // This bypasses CORS by routing through a public proxy
        const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${apiLang}&dt=t&q=${encodeURIComponent(text)}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(googleUrl)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error('Proxy error');
        
        const data = await response.json();
        const contents = JSON.parse(data.contents);
        
        // Google translate returns nested arrays: [[["Translated", "Original", ...], ...], ...]
        if (Array.isArray(contents) && Array.isArray(contents[0])) {
          translatedText = contents[0].map(segment => segment[0]).join('');
        } else {
          throw new Error('Invalid response format');
        }
      }
      
      if (translatedText) {
        translationCache[cacheKey] = translatedText;
        setCache(translationCache);
        resolve(translatedText);
      } else {
        resolve(text);
      }

    } catch (error) {
      console.error(`Translation failed for "${text}" to ${targetLang}:`, error);
      resolve(text);
    }
    
    // Delay to be nice to the APIs
    await new Promise(r => setTimeout(r, 500));
  }

  isProcessing = false;
};

export const translateText = (text, targetLang) => {
  if (!text) return Promise.resolve('');
  if (targetLang === 'en') return Promise.resolve(text);

  const cacheKey = `${text}_${targetLang}`;
  
  if (translationCache[cacheKey]) {
    return Promise.resolve(translationCache[cacheKey]);
  }

  return new Promise((resolve, reject) => {
    queue.push({ text, targetLang, resolve, reject });
    processQueue();
  });
};
