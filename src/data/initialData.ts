import { CompanySettings, RolePermission } from '../types';

// Static app configuration - not business/fleet data, so this stays local
// rather than living in a Google Sheet. Fleet data itself is fetched live
// via src/services/googleSheetsApi.ts.

export const initialCompanySettings: CompanySettings = {
  companyName: 'Piramal Petroleum & Logistics Ltd.',
  tagline: 'Enterprise Fleet & Hazardous Material Tanker Operations',
  taxId: '27AABCP1234F1ZM',
  email: 'info@piramalpetroleum.com',
  phone: '+91 (22) 6700-8000',
  address: 'Piramal Tower, Peninsula Corporate Park, Lower Parel, Mumbai - 400013',
  logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&q=80&w=200',
  reminderDaysThreshold: 30,
  googleSheetsWebAppUrl: 'https://script.google.com/macros/s/AKfycbxUVjK1LfngdVJzYDHN0490v7vgoNry42lOydqyEsz42v160MZ_n1jQZKd9YGHFnGHW/exec',
  autoSyncEnabled: true,
};

export const initialRolePermissions: RolePermission[] = [
  {
    role: 'Admin',
    canViewDashboard: true,
    canManageTankers: true,
    canManageMaintenance: true,
    canManageExpenses: true,
    canManageBreakdowns: true,
    canManageCompliance: true,
    canViewReports: true,
    canManageUsers: true,
    canEditSettings: true,
  },
  {
    role: 'Manager',
    canViewDashboard: true,
    canManageTankers: true,
    canManageMaintenance: true,
    canManageExpenses: true,
    canManageBreakdowns: true,
    canManageCompliance: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false,
  },
  {
    role: 'Maintenance Executive',
    canViewDashboard: true,
    canManageTankers: false,
    canManageMaintenance: true,
    canManageExpenses: true,
    canManageBreakdowns: true,
    canManageCompliance: true,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false,
  },
  {
    role: 'Transport Coordinator',
    canViewDashboard: true,
    canManageTankers: true,
    canManageMaintenance: true,
    canManageExpenses: false,
    canManageBreakdowns: true,
    canManageCompliance: true,
    canViewReports: false,
    canManageUsers: false,
    canEditSettings: false,
  },
  {
    role: 'Viewer',
    canViewDashboard: true,
    canManageTankers: false,
    canManageMaintenance: false,
    canManageExpenses: false,
    canManageBreakdowns: false,
    canManageCompliance: false,
    canViewReports: true,
    canManageUsers: false,
    canEditSettings: false,
  },
];
