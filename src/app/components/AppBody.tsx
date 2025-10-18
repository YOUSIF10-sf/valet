'use client';

import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import Header from './Header';

type Props = {
  children: React.ReactNode;
};

export default function AppBody({ children }: Props) {
  // Safely type the translation context so we can remove @ts-ignore
  const ctx = useTranslation() as { language?: string } | undefined;
  const language = ctx?.language ?? 'en';

  // Use a wrapper element instead of returning <body>.
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
