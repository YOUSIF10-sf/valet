'use client';

import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

export default function AppBody({ children }: Props) {
  const { language } = useTranslation();

  return (
    <div
      className={language === 'ar' ? 'rtl' : 'ltr'}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Header />
      {children}
    </div>
  );
}
