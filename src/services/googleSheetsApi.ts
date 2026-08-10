import { getGoogleSheetsUrl } from './googleSheetsSync';

/**
 * Real sheet tab names in the deployed spreadsheet (verified live against the
 * Apps Script Web App). Only these tabs exist today - Fuel/Tyres/Battery/
 * Insurance/Fitness/Permit/PUC have no backing tab yet.
 */
export const SHEET_NAMES = {
  users: 'Users',
  tankers: 'Vehicle Master',
  maintenance: 'Maintenance',
  expenses: 'Expenses',
  breakdown: 'Breakdown',
} as const;

// Exact column order of each sheet tab - insert/update payloads must match
// this order since the backend writes plain positional arrays, not objects.
const SHEET_COLUMNS: Record<string, string[]> = {
  Users: ['name', 'id', 'Password', 'role', 'lastLogin'],
  'Vehicle Master': [
    'id', 'tankerNumber', 'registrationNumber', 'vehicleType', 'capacity', 'manufacturer', 'model',
    'engineNumber', 'chassisNumber', 'purchaseDate', 'purchaseCost', 'owner', 'driver', 'transporter',
    'currentKm', 'status', 'location', 'remarks', 'updatedAt', 'photoUrl',
  ],
  Maintenance: [
    'id', 'date', 'tankerId', 'tankerNumber', 'currentKm', 'type', 'vendor', 'workshop', 'complaint',
    'workDescription', 'labourCost', 'materialCost', 'otherCost', 'totalCost', 'expectedCompletion',
    'actualCompletion', 'status', 'remarks',
  ],
  Expenses: ['id', 'date', 'tankerNumber', 'category', 'amount', 'vendor', 'invoiceNumber', 'description', 'paidBy'],
  Breakdown: [
    'id', 'date', 'tankerNumber', 'location', 'driverName', 'complaint', 'status', 'assignedMechanic',
    'estimatedCost', 'finalCost', 'resolvedDate', 'remarks',
  ],
};

const NUMERIC_FIELDS: Record<string, string[]> = {
  'Vehicle Master': ['purchaseCost', 'currentKm'],
  Maintenance: ['currentKm', 'labourCost', 'materialCost', 'otherCost', 'totalCost'],
  Expenses: ['amount'],
  Breakdown: ['estimatedCost', 'finalCost'],
};

function coerceValue(sheetName: string, key: string, value: any): any {
  if ((NUMERIC_FIELDS[sheetName] || []).includes(key)) {
    return value === '' || value === undefined || value === null ? 0 : Number(value);
  }
  return value === '' ? undefined : value;
}

interface RawRow {
  rowIndex: number; // 1-based row number in the actual sheet (row 1 = header)
  values: any[];
}

interface SheetGrid<T> {
  headers: string[];
  objects: T[];
  raw: RawRow[];
}

/**
 * Reads a sheet tab as a raw grid (GET ?sheet=<name>) and zips the header
 * row into typed objects. A sheet with no header row (blank tab) yields [].
 */
async function readSheetRaw<T>(sheetName: string): Promise<SheetGrid<T>> {
  const url = getGoogleSheetsUrl();
  if (!url) throw new Error('Google Sheets Web App URL not configured.');

  const res = await fetch(`${url}?sheet=${encodeURIComponent(sheetName)}`);
  if (!res.ok) throw new Error(`Failed to fetch sheet "${sheetName}": HTTP ${res.status}`);

  const body = await res.json();
  if (!body.success) throw new Error(body.error || `Failed to fetch sheet "${sheetName}"`);

  const grid: any[][] = body.data || [];
  const headers: string[] = (grid[0] || []).map((h: any) => String(h || '').trim());

  // A blank/uninitialized tab comes back as [['']]
  if (headers.length === 0 || (headers.length === 1 && headers[0] === '')) {
    return { headers: [], objects: [], raw: [] };
  }

  const dataRows = grid.slice(1);
  const raw: RawRow[] = dataRows.map((values, i) => ({ rowIndex: i + 2, values }));

  const objects: T[] = raw.map(({ values }) => {
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => {
      obj[h] = coerceValue(sheetName, h, values[i]);
    });
    return obj as T;
  });

  return { headers, objects, raw };
}

export async function fetchSheet<T>(sheetKey: keyof typeof SHEET_NAMES): Promise<T[]> {
  const { objects } = await readSheetRaw<T>(SHEET_NAMES[sheetKey]);
  return objects;
}

export interface SheetFetchResult {
  key: string;
  data: any[];
  error?: string;
}

/**
 * Fetches every connected sheet in parallel. Individual failures don't block
 * the others - callers can decide how to surface partial failures.
 */
export async function fetchAllSheets(): Promise<Record<string, SheetFetchResult>> {
  const entries = Object.entries(SHEET_NAMES);

  const settled = await Promise.allSettled(entries.map(([, sheetName]) => readSheetRaw(sheetName)));

  const results: Record<string, SheetFetchResult> = {};
  settled.forEach((outcome, i) => {
    const [key, sheetName] = entries[i];
    if (outcome.status === 'fulfilled') {
      results[key] = { key, data: outcome.value.objects };
    } else {
      results[key] = { key, data: [], error: (outcome as PromiseRejectedResult).reason?.message || `Failed to load ${sheetName}` };
    }
  });

  return results;
}

async function postForm(params: Record<string, string>): Promise<any> {
  const url = getGoogleSheetsUrl();
  if (!url) throw new Error('Google Sheets Web App URL not configured.');

  const res = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(params),
  });
  return res.json();
}

async function findRowIndexById(sheetName: string, idValue: string): Promise<number | null> {
  const { headers, raw } = await readSheetRaw(sheetName);
  const idCol = headers.indexOf('id');
  if (idCol === -1) return null;
  const match = raw.find((r) => String(r.values[idCol]) === String(idValue));
  return match ? match.rowIndex : null;
}

/**
 * Appends a new row to a sheet. `values` keys should match the object shape
 * used across the app (e.g. Tanker, MaintenanceRecord); extra keys not
 * present as a sheet column are silently dropped, missing ones become "".
 */
export async function createRecord(sheetKey: keyof typeof SHEET_NAMES, values: Record<string, any>): Promise<void> {
  const sheetName = SHEET_NAMES[sheetKey];
  const columns = SHEET_COLUMNS[sheetName];
  const rowData = columns.map((c) => (values[c] !== undefined && values[c] !== null ? values[c] : ''));

  const result = await postForm({
    action: 'insert',
    sheetName,
    rowData: JSON.stringify(rowData),
  });
  if (!result.success) throw new Error(result.error || `Failed to create record in ${sheetName}`);
}

export async function updateRecord(sheetKey: keyof typeof SHEET_NAMES, id: string, values: Record<string, any>): Promise<void> {
  const sheetName = SHEET_NAMES[sheetKey];
  const columns = SHEET_COLUMNS[sheetName];
  const rowIndex = await findRowIndexById(sheetName, id);
  if (rowIndex === null) throw new Error(`Record ${id} not found in ${sheetName}`);

  const rowData = columns.map((c) => (values[c] !== undefined && values[c] !== null ? values[c] : ''));

  const result = await postForm({
    action: 'update',
    sheetName,
    rowIndex: String(rowIndex),
    rowData: JSON.stringify(rowData),
  });
  if (!result.success) throw new Error(result.error || `Failed to update record in ${sheetName}`);
}

export async function deleteRecord(sheetKey: keyof typeof SHEET_NAMES, id: string): Promise<void> {
  const sheetName = SHEET_NAMES[sheetKey];
  const rowIndex = await findRowIndexById(sheetName, id);
  if (rowIndex === null) return;

  const result = await postForm({
    action: 'delete',
    sheetName,
    rowIndex: String(rowIndex),
  });
  if (!result.success) throw new Error(result.error || `Failed to delete record in ${sheetName}`);
}

export interface SheetLoginResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Authenticates against the Users sheet directly (the deployed Apps Script
 * has no dedicated auth action). Matches the `id` column - there is no
 * email column in this sheet.
 */
export async function loginWithSheet(loginId: string, password: string): Promise<SheetLoginResult> {
  try {
    const { objects } = await readSheetRaw<any>(SHEET_NAMES.users);
    const found = objects.find((u) => String(u.id || '').toLowerCase() === loginId.trim().toLowerCase());

    if (!found) {
      return { success: false, error: 'User ID not found in Users sheet.' };
    }
    if (String(found.Password || '') !== password) {
      return { success: false, error: 'Invalid password.' };
    }

    return {
      success: true,
      user: {
        id: found.id,
        name: found.name || found.id,
        email: found.email || '',
        role: found.role,
        phone: found.phone || '',
        department: found.department || '',
        status: 'Active',
        lastLogin: found.lastLogin || '',
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unable to reach Google Sheets backend.' };
  }
}
