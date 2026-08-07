import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  initialUsers,
  initialTankers,
  initialMaintenanceRecords,
  initialTyres,
  initialBatteries,
  initialInsurances,
  initialFitness,
  initialPermits,
  initialPucs,
  initialExpenses,
  initialBreakdowns,
  initialDocuments,
  initialNotifications,
  initialCompanySettings,
  initialRolePermissions,
  initialActivityLogs,
} from './src/data/initialData';
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
} from './src/types';

dotenv.config();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tanker_management_jwt_secret_key_2026';

// Server-side State Engine
let usersData: User[] = [...initialUsers];
let tankersData: Tanker[] = [...initialTankers];
let maintenanceData: MaintenanceRecord[] = [...initialMaintenanceRecords];
let tyresData: TyreRecord[] = [...initialTyres];
let batteryData: BatteryRecord[] = [...initialBatteries];
let insuranceData: ComplianceInsurance[] = [...initialInsurances];
let fitnessData: ComplianceFitness[] = [...initialFitness];
let permitData: CompliancePermit[] = [...initialPermits];
let pucData: CompliancePuc[] = [...initialPucs];
let expenseData: ExpenseRecord[] = [...initialExpenses];
let breakdownData: BreakdownRecord[] = [...initialBreakdowns];
let documentData: SystemDocument[] = [...initialDocuments];
let notificationData: NotificationItem[] = [...initialNotifications];
let settingsData: CompanySettings = { ...initialCompanySettings };
let activityLogsData: ActivityLog[] = [...initialActivityLogs];

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Helper logging
  const logActivity = (user: string, action: string, module: string, details: string) => {
    const log: ActivityLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      user,
      action,
      module,
      details,
    };
    activityLogsData.unshift(log);
  };

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      system: 'Tanker Maintenance Management System API',
      version: '2.4.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = usersData.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid user credentials. Please check your email.' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ error: 'Your account is inactive. Please contact the administrator.' });
    }

    // Update last login
    user.lastLogin = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    logActivity(user.name, 'LOGIN', 'Auth', `Logged in successfully as ${user.role}`);

    res.json({
      token,
      user,
      permissions: initialRolePermissions.find((p) => p.role === user.role),
    });
  });

  // Auth: Forgot Password
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = usersData.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

    if (!user) {
      return res.status(404).json({ error: 'No user account found with this email address.' });
    }

    res.json({
      message: `Password reset instructions and verification token have been sent to ${email}.`,
    });
  });

  // Tankers API
  app.get('/api/tankers', (req: Request, res: Response) => {
    res.json(tankersData);
  });

  app.post('/api/tankers', (req: Request, res: Response) => {
    const newTanker: Tanker = {
      ...req.body,
      id: req.body.id || `TNK-${(tankersData.length + 1).toString().padStart(3, '0')}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    tankersData.unshift(newTanker);
    logActivity('System User', 'CREATE', 'Tankers', `Added Tanker ${newTanker.tankerNumber}`);
    res.status(201).json(newTanker);
  });

  app.put('/api/tankers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = tankersData.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: 'Tanker not found' });

    tankersData[index] = {
      ...tankersData[index],
      ...req.body,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    logActivity('System User', 'UPDATE', 'Tankers', `Updated Tanker ${tankersData[index].tankerNumber}`);
    res.json(tankersData[index]);
  });

  app.delete('/api/tankers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const tanker = tankersData.find((t) => t.id === id);
    tankersData = tankersData.filter((t) => t.id !== id);
    if (tanker) {
      logActivity('System User', 'DELETE', 'Tankers', `Deleted Tanker ${tanker.tankerNumber}`);
    }
    res.json({ success: true, id });
  });

  // Maintenance API
  app.get('/api/maintenance', (req: Request, res: Response) => {
    res.json(maintenanceData);
  });

  app.post('/api/maintenance', (req: Request, res: Response) => {
    const record: MaintenanceRecord = {
      ...req.body,
      id: req.body.id || `MNT-2026-${(maintenanceData.length + 90).toString().padStart(3, '0')}`,
    };
    maintenanceData.unshift(record);

    // If maintenance is Running or Pending, update tanker status if needed
    if (record.status === 'Running') {
      const tanker = tankersData.find((t) => t.tankerNumber === record.tankerNumber);
      if (tanker) tanker.status = 'Under Maintenance';
    }

    logActivity('System User', 'CREATE', 'Maintenance', `Created Maintenance ${record.id} for ${record.tankerNumber}`);
    res.status(201).json(record);
  });

  app.put('/api/maintenance/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = maintenanceData.findIndex((m) => m.id === id);
    if (index === -1) return res.status(404).json({ error: 'Record not found' });

    maintenanceData[index] = { ...maintenanceData[index], ...req.body };

    // If completed, update Tanker status back to Available
    if (req.body.status === 'Completed') {
      const tanker = tankersData.find((t) => t.tankerNumber === maintenanceData[index].tankerNumber);
      if (tanker && tanker.status === 'Under Maintenance') {
        tanker.status = 'Available';
      }
    }

    logActivity('System User', 'UPDATE', 'Maintenance', `Updated Maintenance ${id}`);
    res.json(maintenanceData[index]);
  });

  // Tyres API
  app.get('/api/tyres', (req: Request, res: Response) => res.json(tyresData));
  app.post('/api/tyres', (req: Request, res: Response) => {
    const tyre: TyreRecord = { ...req.body, id: `TYR-${Date.now().toString().slice(-4)}` };
    tyresData.unshift(tyre);
    res.status(201).json(tyre);
  });

  // Battery API
  app.get('/api/battery', (req: Request, res: Response) => res.json(batteryData));
  app.post('/api/battery', (req: Request, res: Response) => {
    const battery: BatteryRecord = { ...req.body, id: `BAT-${Date.now().toString().slice(-4)}` };
    batteryData.unshift(battery);
    res.status(201).json(battery);
  });

  // Compliance APIs (Insurance, Fitness, Permit, PUC)
  app.get('/api/insurance', (req: Request, res: Response) => res.json(insuranceData));
  app.get('/api/fitness', (req: Request, res: Response) => res.json(fitnessData));
  app.get('/api/permit', (req: Request, res: Response) => res.json(permitData));
  app.get('/api/puc', (req: Request, res: Response) => res.json(pucData));

  // Expenses API
  app.get('/api/expenses', (req: Request, res: Response) => res.json(expenseData));
  app.post('/api/expenses', (req: Request, res: Response) => {
    const expense: ExpenseRecord = { ...req.body, id: `EXP-${Date.now().toString().slice(-4)}` };
    expenseData.unshift(expense);
    res.status(201).json(expense);
  });

  // Breakdown API
  app.get('/api/breakdowns', (req: Request, res: Response) => res.json(breakdownData));
  app.post('/api/breakdowns', (req: Request, res: Response) => {
    const bkd: BreakdownRecord = {
      ...req.body,
      id: req.body.id || `BKD-2026-${(breakdownData.length + 15).toString().padStart(3, '0')}`,
    };
    breakdownData.unshift(bkd);

    // Update tanker status to Breakdown
    const tanker = tankersData.find((t) => t.tankerNumber === bkd.tankerNumber);
    if (tanker) tanker.status = 'Breakdown';

    logActivity('System User', 'CREATE', 'Breakdown', `Reported Breakdown ${bkd.id} for ${bkd.tankerNumber}`);
    res.status(201).json(bkd);
  });

  app.put('/api/breakdowns/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = breakdownData.findIndex((b) => b.id === id);
    if (index === -1) return res.status(404).json({ error: 'Breakdown not found' });

    breakdownData[index] = { ...breakdownData[index], ...req.body };

    if (req.body.status === 'Resolved') {
      const tanker = tankersData.find((t) => t.tankerNumber === breakdownData[index].tankerNumber);
      if (tanker && tanker.status === 'Breakdown') {
        tanker.status = 'Available';
      }
    }

    res.json(breakdownData[index]);
  });

  // Documents API
  app.get('/api/documents', (req: Request, res: Response) => res.json(documentData));
  app.post('/api/documents', (req: Request, res: Response) => {
    const doc: SystemDocument = { ...req.body, id: `DOC-${Date.now().toString().slice(-4)}` };
    documentData.unshift(doc);
    res.status(201).json(doc);
  });

  // Notifications API
  app.get('/api/notifications', (req: Request, res: Response) => res.json(notificationData));
  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const { id } = req.params;
    const item = notificationData.find((n) => n.id === id);
    if (item) item.read = true;
    res.json({ success: true, id });
  });

  // Users API
  app.get('/api/users', (req: Request, res: Response) => res.json(usersData));
  app.post('/api/users', (req: Request, res: Response) => {
    const user: User = { ...req.body, id: `USR-${(usersData.length + 1).toString().padStart(3, '0')}` };
    usersData.push(user);
    res.status(201).json(user);
  });

  // Settings API
  app.get('/api/settings', (req: Request, res: Response) => res.json(settingsData));
  app.put('/api/settings', (req: Request, res: Response) => {
    settingsData = { ...settingsData, ...req.body };
    res.json(settingsData);
  });

  // Activity Logs API
  app.get('/api/activity-logs', (req: Request, res: Response) => res.json(activityLogsData));

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tanker Maintenance System Server listening on http://localhost:${PORT}`);
  });
}

startServer();
