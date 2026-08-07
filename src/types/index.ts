export type UserRole = 
  | 'Admin'
  | 'Manager'
  | 'Maintenance Executive'
  | 'Transport Coordinator'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  fullName?: string;
  username?: string;
  email: string;
  role: UserRole;
  phone: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  avatarUrl?: string;
}

export interface Reminder {
  id: string;
  tankerNumber: string;
  category: string;
  dueDate: string;
  daysRemaining: number;
  severity: 'High' | 'Medium' | 'Low';
}

export type TankerStatus = 'Available' | 'Under Maintenance' | 'Breakdown' | 'In Transit';

export type VehicleType = 
  | 'Director Car / Luxury Sedan'
  | 'Executive SUV'
  | 'Company Car'
  | 'Staff Transport Van'
  | 'Fuel Tanker'
  | 'Chemical Tanker'
  | 'Water Tanker'
  | 'LPG Tanker'
  | 'Petroleum Tanker'
  | string;

export interface Tanker {
  id: string; // e.g. VEH-001 / TNK-001
  tankerNumber: string; // Registration Number / Asset ID
  registrationNumber: string;
  vehicleType: VehicleType;
  capacity: string; // e.g. "5 Seater", "7 Seater VIP", "24,000 Litres"
  manufacturer: string; // e.g. "Mercedes-Benz", "Toyota", "BharatBenz", "BMW"
  model: string;
  engineNumber: string;
  chassisNumber: string;
  purchaseDate: string;
  purchaseCost: number;
  owner: string; // e.g. "Piramal Group Board", "Directorate Office", "Fleet Ops"
  driver: string; // e.g. "Personal Chauffeur - Ramesh", "Mahesh Jadhav"
  transporter: string;
  currentKm: number;
  status: TankerStatus;
  location: string;
  photoUrl?: string;
  rcDocumentUrl?: string;
  insuranceDocumentUrl?: string;
  fitnessDocumentUrl?: string;
  permitDocumentUrl?: string;
  pucDocumentUrl?: string;
  remarks?: string;
  updatedAt: string;
  lastServiceDate?: string;
  lastServiceKm?: number;
  nextServiceDueDate?: string;
  nextServiceDueKm?: number;
}

export type MaintenanceType = 'Preventive' | 'Corrective' | 'Emergency';
export type MaintenanceStatus = 'Pending' | 'Running' | 'Completed';

export interface SparePartItem {
  id: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface MaintenanceRecord {
  id: string; // e.g. MNT-2026-001
  date: string;
  tankerId: string;
  tankerNumber: string;
  currentKm: number;
  type: MaintenanceType;
  vendor: string;
  workshop: string;
  complaint: string;
  workDescription: string;
  spareParts: SparePartItem[];
  labourCost: number;
  materialCost: number;
  otherCost: number;
  totalCost: number;
  expectedCompletion: string;
  actualCompletion?: string;
  status: MaintenanceStatus;
  invoiceUrl?: string;
  photoUrl?: string;
  remarks?: string;
  nextServiceDueDate?: string;
  nextServiceDueKm?: number;
}

export interface TyreRecord {
  id: string;
  tyreNumber: string;
  brand: string;
  purchaseDate: string;
  purchaseCost: number;
  installedPosition: 'Front Left' | 'Front Right' | 'Rear Outer Left' | 'Rear Inner Left' | 'Rear Outer Right' | 'Rear Inner Right' | 'Spare';
  currentPosition: string;
  tankerNumber: string;
  runningKm: number;
  replacementDueKm: number;
  status: 'Good' | 'Needs Rotation' | 'Worn Out' | 'Replaced';
}

export interface BatteryRecord {
  id: string;
  batteryNumber: string;
  brand: string;
  tankerNumber: string;
  purchaseDate: string;
  warrantyMonths: number;
  warrantyExpiry: string;
  replacementDue: string;
  status: 'Healthy' | 'Low Charge' | 'Under Warranty' | 'Replaced';
}

export interface ComplianceInsurance {
  id: string;
  tankerNumber: string;
  policyNumber: string;
  company: string;
  premium: number;
  startDate: string;
  expiryDate: string;
  documentUrl?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface ComplianceFitness {
  id: string;
  tankerNumber: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface CompliancePermit {
  id: string;
  tankerNumber: string;
  permitType: 'National Permit' | 'State Permit' | 'Special Hazardous Permit';
  permitNumber: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface CompliancePuc {
  id: string;
  tankerNumber: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export type ExpenseCategory = 'Fuel' | 'Repair' | 'Tyre' | 'Battery' | 'Oil' | 'Insurance' | 'Permit' | 'Fitness' | 'Miscellaneous';

export interface ExpenseRecord {
  id: string;
  date: string;
  tankerNumber: string;
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  invoiceNumber?: string;
  description: string;
  paidBy: string;
}

export interface FuelLog {
  id: string;
  date: string;
  tankerNumber: string;
  driverName: string;
  litres: number;
  ratePerLitre: number;
  totalAmount: number;
  odometerKm: number;
  fuelStation: string;
  fullTank: boolean;
}

export interface BreakdownRecord {
  id: string;
  date: string;
  breakdownDate?: string;
  tankerNumber: string;
  location: string;
  driverName: string;
  driverPhone?: string;
  issueCategory?: string;
  complaint: string;
  description?: string;
  actionTaken?: string;
  towingRequired?: boolean;
  photoUrl?: string;
  status: 'Reported' | 'Mechanic Assigned' | 'In Progress' | 'Resolved';
  assignedMechanic: string;
  estimatedCost: number;
  finalCost?: number;
  resolvedDate?: string;
  remarks?: string;
}

export interface SystemDocument {
  id: string;
  title: string;
  category: 'RC' | 'Insurance' | 'Fitness' | 'Permit' | 'PUC' | 'Invoice' | 'Service Bills' | 'Photos' | 'Other';
  tankerNumber: string;
  uploadDate: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png';
  fileUrl: string;
  uploadedBy: string;
}

export interface NotificationItem {
  id: string;
  type: 'Insurance' | 'Permit' | 'Fitness' | 'PUC' | 'Maintenance' | 'Battery' | 'Tyre' | 'Breakdown';
  title: string;
  message: string;
  date: string;
  tankerNumber: string;
  read: boolean;
  urgency: 'high' | 'medium' | 'low';
}

export interface CompanySettings {
  companyName: string;
  tagline: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  reminderDaysThreshold: number;
  googleSheetsWebAppUrl: string;
  autoSyncEnabled: boolean;
  lastSyncTime?: string;
}

export interface RolePermission {
  role: UserRole;
  canViewDashboard: boolean;
  canManageTankers: boolean;
  canManageMaintenance: boolean;
  canManageExpenses: boolean;
  canManageBreakdowns: boolean;
  canManageCompliance: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canEditSettings: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
}
