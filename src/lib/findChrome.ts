import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function findChrome() {
  const commonPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe', // Fallback to Edge
  ];

  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }

  throw new Error("لم يتم العثور على متصفح Chrome أو Edge لتوليد الـ PDF. يرجى تثبيت Chrome.");
}
