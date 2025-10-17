'use client';

import { useTranslation } from '../context/TranslationContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useTranslation();

  return (
    <button onClick={toggleLanguage} className="language-switcher">
      {language === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
