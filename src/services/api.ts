import axios from 'axios';
import {
  Tanker,
  MaintenanceRecord,
  TyreRecord,
  BatteryRecord,
  ComplianceInsurance,
  ComplianceFitness,
  CompliancePermit,
  CompliancePuc,
  ExpenseRecord,
  BreakdownRecord,
  SystemDocument,
  NotificationItem,
  User,
  CompanySettings,
  ActivityLog,
} from '../types';

const API_BASE = '/api';

export const api = {
  // Auth
  login: async (credentials: { email: string; password?: string }) => {
    const res = await axios.post(`${API_BASE}/auth/login`, credentials);
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return res.data;
  },

  // Tankers
  getTankers: async (): Promise<Tanker[]> => {
    const res = await axios.get(`${API_BASE}/tankers`);
    return res.data;
  },
  createTanker: async (data: Partial<Tanker>): Promise<Tanker> => {
    const res = await axios.post(`${API_BASE}/tankers`, data);
    return res.data;
  },
  updateTanker: async (id: string, data: Partial<Tanker>): Promise<Tanker> => {
    const res = await axios.put(`${API_BASE}/tankers/${id}`, data);
    return res.data;
  },
  deleteTanker: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/tankers/${id}`);
  },

  // Maintenance
  getMaintenance: async (): Promise<MaintenanceRecord[]> => {
    const res = await axios.get(`${API_BASE}/maintenance`);
    return res.data;
  },
  createMaintenance: async (data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const res = await axios.post(`${API_BASE}/maintenance`, data);
    return res.data;
  },
  updateMaintenance: async (id: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const res = await axios.put(`${API_BASE}/maintenance/${id}`, data);
    return res.data;
  },

  // Tyres & Battery
  getTyres: async (): Promise<TyreRecord[]> => (await axios.get(`${API_BASE}/tyres`)).data,
  createTyre: async (data: Partial<TyreRecord>): Promise<TyreRecord> => (await axios.post(`${API_BASE}/tyres`, data)).data,

  getBatteries: async (): Promise<BatteryRecord[]> => (await axios.get(`${API_BASE}/battery`)).data,
  createBattery: async (data: Partial<BatteryRecord>): Promise<BatteryRecord> => (await axios.post(`${API_BASE}/battery`, data)).data,

  // Compliance
  getInsurances: async (): Promise<ComplianceInsurance[]> => (await axios.get(`${API_BASE}/insurance`)).data,
  getFitness: async (): Promise<ComplianceFitness[]> => (await axios.get(`${API_BASE}/fitness`)).data,
  getPermits: async (): Promise<CompliancePermit[]> => (await axios.get(`${API_BASE}/permit`)).data,
  getPucs: async (): Promise<CompliancePuc[]> => (await axios.get(`${API_BASE}/puc`)).data,

  // Expenses & Breakdowns
  getExpenses: async (): Promise<ExpenseRecord[]> => (await axios.get(`${API_BASE}/expenses`)).data,
  createExpense: async (data: Partial<ExpenseRecord>): Promise<ExpenseRecord> => (await axios.post(`${API_BASE}/expenses`, data)).data,

  getBreakdowns: async (): Promise<BreakdownRecord[]> => (await axios.get(`${API_BASE}/breakdowns`)).data,
  createBreakdown: async (data: Partial<BreakdownRecord>): Promise<BreakdownRecord> => (await axios.post(`${API_BASE}/breakdowns`, data)).data,
  updateBreakdown: async (id: string, data: Partial<BreakdownRecord>): Promise<BreakdownRecord> => (await axios.put(`${API_BASE}/breakdowns/${id}`, data)).data,

  // Documents & Notifications
  getDocuments: async (): Promise<SystemDocument[]> => (await axios.get(`${API_BASE}/documents`)).data,
  createDocument: async (data: Partial<SystemDocument>): Promise<SystemDocument> => (await axios.post(`${API_BASE}/documents`, data)).data,

  getNotifications: async (): Promise<NotificationItem[]> => (await axios.get(`${API_BASE}/notifications`)).data,
  markNotificationRead: async (id: string): Promise<void> => {
    await axios.put(`${API_BASE}/notifications/${id}/read`);
  },

  // Users & Settings
  getUsers: async (): Promise<User[]> => (await axios.get(`${API_BASE}/users`)).data,
  createUser: async (data: Partial<User>): Promise<User> => (await axios.post(`${API_BASE}/users`, data)).data,

  getSettings: async (): Promise<CompanySettings> => (await axios.get(`${API_BASE}/settings`)).data,
  updateSettings: async (data: Partial<CompanySettings>): Promise<CompanySettings> => (await axios.put(`${API_BASE}/settings`, data)).data,

  getActivityLogs: async (): Promise<ActivityLog[]> => (await axios.get(`${API_BASE}/activity-logs`)).data,
};
