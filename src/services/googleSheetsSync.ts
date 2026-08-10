import { initialCompanySettings } from '../data/initialData';

const DEFAULT_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbxUVjK1LfngdVJzYDHN0490v7vgoNry42lOydqyEsz42v160MZ_n1jQZKd9YGHFnGHW/exec';

export function getGoogleSheetsUrl(): string {
  try {
    const saved = localStorage.getItem('googleSheetAppUrl');
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    // ignore
  }
  return initialCompanySettings?.googleSheetsWebAppUrl || DEFAULT_WEB_APP_URL;
}

export function setGoogleSheetsUrl(url: string): void {
  try {
    localStorage.setItem('googleSheetAppUrl', url.trim());
  } catch (e) {
    // ignore
  }
}
