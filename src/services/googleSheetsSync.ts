import { companySettings } from '../data/initialData';

const DEFAULT_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyhQ4Y-KRCjRUcGv-7TfhTZeh6YimY0RTLnUS-H89jZyRP9gOyNuoPka38kw3uOarLr/exec';

export function getGoogleSheetsUrl(): string {
  try {
    const saved = localStorage.getItem('googleSheetAppUrl');
    if (saved && saved.trim()) return saved.trim();
  } catch (e) {
    // ignore
  }
  return companySettings?.googleSheetsWebAppUrl || DEFAULT_WEB_APP_URL;
}

export function setGoogleSheetsUrl(url: string): void {
  try {
    localStorage.setItem('googleSheetAppUrl', url.trim());
  } catch (e) {
    // ignore
  }
}

/**
 * Sends a POST payload to Google Apps Script Web App API to sync record.
 */
export async function syncToGoogleSheet(
  action: 'create' | 'update' | 'delete',
  sheetName: string,
  data: any
): Promise<boolean> {
  const url = getGoogleSheetsUrl();
  if (!url) {
    console.warn('Google Sheets Web App URL not configured.');
    return false;
  }

  try {
    const payload = JSON.stringify({
      action,
      sheet: sheetName,
      data,
      id: data?.id,
    });

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload,
    });

    console.log(`Synced ${action} to Google Sheet [${sheetName}] successfully:`, data);
    return true;
  } catch (err) {
    console.error(`Failed to sync to Google Sheet [${sheetName}]:`, err);
    return false;
  }
}

/**
 * Bulk syncs all records from state into Google Sheet.
 */
export async function syncAllDataToGoogleSheet(dataMap: {
  tankers?: any[];
  maintenance?: any[];
  fuelLogs?: any[];
  tyres?: any[];
  batteries?: any[];
  insurances?: any[];
  fitness?: any[];
  permits?: any[];
  pucs?: any[];
  breakdowns?: any[];
  documents?: any[];
}): Promise<{ success: boolean; syncedCount: number }> {
  let count = 0;
  const sheets: Array<{ name: string; items?: any[] }> = [
    { name: 'Tankers', items: dataMap.tankers },
    { name: 'Maintenance', items: dataMap.maintenance },
    { name: 'Fuel', items: dataMap.fuelLogs },
    { name: 'Tyres', items: dataMap.tyres },
    { name: 'Battery', items: dataMap.batteries },
    { name: 'Insurance', items: dataMap.insurances },
    { name: 'Fitness', items: dataMap.fitness },
    { name: 'Permit', items: dataMap.permits },
    { name: 'PUC', items: dataMap.pucs },
    { name: 'Breakdown', items: dataMap.breakdowns },
    { name: 'Documents', items: dataMap.documents },
  ];

  for (const item of sheets) {
    if (item.items && item.items.length > 0) {
      for (const row of item.items) {
        await syncToGoogleSheet('create', item.name, row);
        count++;
      }
    }
  }

  return { success: true, syncedCount: count };
}
