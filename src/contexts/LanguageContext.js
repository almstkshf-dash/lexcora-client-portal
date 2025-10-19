"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useEffect(() => {
    // Load saved language preference
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
    setDirection(savedLocale === 'ar' ? 'rtl' : 'ltr');
    
    // Apply direction to document
    document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLocale;
  }, []);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    setDirection(newLocale === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('locale', newLocale);
    
    // Apply direction to document
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    
    // Reload the page to apply changes
    window.location.reload();
  };

  const value = {
    locale,
    direction,
    changeLanguage,
    isArabic: locale === 'ar',
    isEnglish: locale === 'en'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
