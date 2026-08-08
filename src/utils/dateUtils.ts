/**
 * Utility functions for standardizing date formatting to DD-MM-YYYY across the app and Google Sheets.
 */

const pad = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

/**
 * Converts any date representation (YYYY-MM-DD, ISO string, Date object, DD-MM-YYYY)
 * into standard DD-MM-YYYY format (or DD-MM-YYYY HH:mm AM/PM if time is attached).
 */
export function formatToDDMMYYYY(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return '';
    const day = pad(dateInput.getDate());
    const month = pad(dateInput.getMonth() + 1);
    const year = dateInput.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const str = String(dateInput).trim();
  if (!str) return '';

  // Check if string contains time component like '07-08-2026 08:30 AM' or '2026-08-07 08:30 AM'
  const timeMatch = str.match(/\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)/);
  const timePart = timeMatch ? timeMatch[0] : '';
  const pureDateStr = timePart ? str.replace(timeMatch[0], '').trim() : str;

  // If already in DD-MM-YYYY format (e.g. 07-08-2026 or 7-8-2026)
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(pureDateStr)) {
    const parts = pureDateStr.split('-');
    const formattedDate = `${pad(parseInt(parts[0], 10))}-${pad(parseInt(parts[1], 10))}-${parts[2]}`;
    return formattedDate + timePart;
  }

  // If in YYYY-MM-DD format (e.g. 2026-08-07)
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(pureDateStr)) {
    const parts = pureDateStr.split('-');
    const formattedDate = `${pad(parseInt(parts[2], 10))}-${pad(parseInt(parts[1], 10))}-${parts[0]}`;
    return formattedDate + timePart;
  }

  // If in YYYY/MM/DD or DD/MM/YYYY format
  if (pureDateStr.includes('/')) {
    const parts = pureDateStr.split('/');
    if (parts[0].length === 4) {
      // YYYY/MM/DD
      const formattedDate = `${pad(parseInt(parts[2], 10))}-${pad(parseInt(parts[1], 10))}-${parts[0]}`;
      return formattedDate + timePart;
    } else if (parts[2]?.length === 4) {
      // DD/MM/YYYY
      const formattedDate = `${pad(parseInt(parts[0], 10))}-${pad(parseInt(parts[1], 10))}-${parts[2]}`;
      return formattedDate + timePart;
    }
  }

  // Try parsing with Date constructor as fallback
  const d = new Date(pureDateStr);
  if (!isNaN(d.getTime())) {
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}${timePart}`;
  }

  return str;
}

/**
 * Parses a DD-MM-YYYY or YYYY-MM-DD string into a JavaScript Date object.
 */
export function parseToDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const str = String(dateStr).trim();
  const pureDateStr = str.split(/\s+/)[0]; // strip time if present

  // If DD-MM-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(pureDateStr)) {
    const [d, m, y] = pureDateStr.split('-').map((v) => parseInt(v, 10));
    return new Date(y, m - 1, d);
  }

  // If YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(pureDateStr)) {
    const [y, m, d] = pureDateStr.split('-').map((v) => parseInt(v, 10));
    return new Date(y, m - 1, d);
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Formats a date string (DD-MM-YYYY or any format) into YYYY-MM-DD
 * for standard HTML <input type="date"> fields.
 */
export function formatForDateInput(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const d = parseToDate(dateStr);
  if (!d) return '';
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

/**
 * Converts output from HTML <input type="date"> (YYYY-MM-DD) into DD-MM-YYYY.
 */
export function formatFromDateInput(yyyyMmDd: string | null | undefined): string {
  if (!yyyyMmDd) return '';
  return formatToDDMMYYYY(yyyyMmDd);
}

/**
 * Returns today's date in DD-MM-YYYY format.
 */
export function getTodayDDMMYYYY(): string {
  return formatToDDMMYYYY(new Date());
}

/**
 * Returns today's date in YYYY-MM-DD format (for input defaults).
 */
export function getTodayYYYYMMDD(): string {
  return formatForDateInput(getTodayDDMMYYYY());
}

/**
 * Adds months to a given date string and returns result in DD-MM-YYYY format.
 */
export function addMonthsToDDMMYYYY(dateStr: string, monthsToAdd: number): string {
  const d = parseToDate(dateStr) || new Date();
  d.setMonth(d.getMonth() + monthsToAdd);
  return formatToDDMMYYYY(d);
}

/**
 * Calculates days remaining between today and an expiry date string (DD-MM-YYYY or YYYY-MM-DD).
 */
export function calculateDaysRemaining(expiryDateStr: string): number {
  const expiry = parseToDate(expiryDateStr);
  if (!expiry) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
