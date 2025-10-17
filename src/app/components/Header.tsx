'use client';

import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-container">
        <Image src="/logo.jpg" alt="Easy Valet Logo" width={150} height={40} />
      </div>
      <LanguageSwitcher />
    </header>
  );
}
