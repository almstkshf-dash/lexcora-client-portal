"use client";

import { useLanguage } from '../contexts/LanguageContext';
// Lazy-load JSON to avoid Turbopack HMR pattern-matching errors with large files
let _cachedMessages = null;
function getMessages() {
  if (!_cachedMessages) {
    _cachedMessages = {
      en: require('../../messages/en.json'),
      ar: require('../../messages/ar.json')
    };
  }
  return _cachedMessages;
}

export const useTranslation = () => {
  const { locale } = useLanguage();
  const messages = getMessages();

  const t = (key, values = {}) => {
    const keys = key.split('.');
    let translation = messages[locale];

    for (const k of keys) {
      translation = translation?.[k];
    }

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in locale: ${locale}`);
      return key;
    }

    // Replace placeholders like {name}
    if (typeof translation === 'string' && Object.keys(values).length > 0) {
      return translation.replace(/{(\w+)}/g, (match, key) => {
        return values[key] !== undefined ? values[key] : match;
      });
    }

    return translation;
  };

  return { t, locale };
};
