import { Inter } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from './context/TranslationContext';
import AppBody from './components/AppBody';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Easy Valet',
  description: 'Daily Operations Report',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <TranslationProvider>
            <AppBody>{children}</AppBody>
        </TranslationProvider>
    </html>
  );
}
