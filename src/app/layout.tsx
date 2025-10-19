import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Cairo as FontCairo } from "next/font/google"
import { cn } from '@/lib/utils';
import { Analytics } from "@vercel/analytics/react"

const fontCairo = FontCairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: 'تقارير خدمة صف السيارات',
  description: 'إدارة التقارير اليومية لخدمة صف السيارات في الفنادق.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontCairo.variable)}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
