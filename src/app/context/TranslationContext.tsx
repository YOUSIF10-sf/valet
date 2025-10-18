'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type TranslationContextType = {
  language: string;
  toggleLanguage: () => void;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function useTranslation(): TranslationContextType {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return ctx;
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'ar' : 'en'));
  };

  return (
    <TranslationContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}