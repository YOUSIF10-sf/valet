'use client';

import { useTranslation } from '../context/TranslationContext';
import Header from './Header';

export default function AppBody({ children }) {
  // @ts-ignore
  const { language } = useTranslation();

  return (
    <body className={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      {children}
    </body>
  );
}