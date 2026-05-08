"use client";

import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  useEffect(() => {
    try {
      // Load saved language preference with validation
      const savedLocale = localStorage.getItem('locale') || 'en';
      if (savedLocale && typeof savedLocale === 'string' && (savedLocale === 'en' || savedLocale === 'ar')) {
        setLocale(savedLocale);
        setDirection(savedLocale === 'ar' ? 'rtl' : 'ltr');
        
        // Apply direction to document - with null checks
        if (typeof document !== 'undefined' && document && document.documentElement) {
          document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.lang = savedLocale;
        }
      }
    } catch (error) {
      console.warn('Error loading language preference:', error);
      // Fallback to English
      setLocale('en');
      setDirection('ltr');
    }
  }, []);

  const changeLanguage = (newLocale) => {
    setLocale(newLocale);
    setDirection(newLocale === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('locale', newLocale);
    
    // Apply direction to document
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
    
    // Reload the page to apply changes
    // window.location.reload();
    // router.refresh();
    
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
