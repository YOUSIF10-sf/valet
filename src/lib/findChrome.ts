import fs from 'fs';
import path from 'path';

export async function findChrome() {
  // If we are in Vercel environment
  if (process.env.VERCEL) {
    const chromium = require('@sparticuz/chromium');
    return await chromium.executablePath();
  }

  // Windows Local Development Paths
  const commonPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome', // Linux fallback
    '/usr/bin/chromium-browser', // Linux fallback
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }

  // If we are in production but not Vercel (e.g. self-hosted)
  // we might still want to try to find chromium
  try {
    const chromium = require('@sparticuz/chromium');
    const path = await chromium.executablePath();
    if (path) return path;
  } catch (e) {}

  throw new Error("لم يتم العثور على متصفح لتوليد الـ PDF. يرجى التأكد من توفر Chrome أو إعدادات Vercel.");
}
