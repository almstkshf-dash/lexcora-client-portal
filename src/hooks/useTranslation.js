"use client";

import { useLanguage } from '../contexts/LanguageContext';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

const messages = {
  en: enMessages,
  ar: arMessages
};

export const useTranslation = () => {
  const { locale } = useLanguage();

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
