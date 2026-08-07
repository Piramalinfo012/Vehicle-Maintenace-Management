import React, { useState } from 'react';
import { Tanker, MaintenanceRecord, FuelLog } from '../types';
import { BarChart3, Download, FileSpreadsheet, FileText, Printer, Filter } from 'lucide-react';
import { exportToExcel, exportToPdf } from '../services/exportUtils';
import { useNotification } from '../context/NotificationContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';

interface ReportsPageProps {
  tankers: Tanker[];
  maintenance: MaintenanceRecord[];
  fuelLogs: FuelLog[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ tankers = [], maintenance = [], fuelLogs = [] }) => {
  const { showToast } = useNotification();
  const [reportType, setReportType] = useState<string>('maintenance');

  // Chart 1: Maintenance cost by tanker
  const costByTankerData = tankers.map((t) => {
    const cost = maintenance
      .filter((m) => m.tankerNumber === t.tankerNumber)
      .reduce((sum, m) => sum + (m.totalCost || 0), 0);
    return {
      tanker: t.tankerNumber,
      cost: cost,
    };
  });

  // Chart 2: Preventive vs Breakdown breakdown
  const preventiveCount = maintenance.filter((m) => m.type === 'Preventive').length;
  const breakdownCount = maintenance.filter((m) => m.type === 'Breakdown' || m.type === 'Corrective').length;

  const typeData = [
    { name: 'Preventive Maintenance', value: preventiveCount, color: '#2563EB' },
    { name: 'Breakdown / Corrective', value: breakdownCount, color: '#DC2626' },
  ];

  const handleExportCSV = () => {
    if (reportType === 'maintenance') {
      exportToExcel(maintenance, 'Fleet_Maintenance_Report');
    } else {
      exportToExcel(fuelLogs, 'Fleet_Fuel_Efficiency_Report');
    }
    showToast('Report Exported', 'Data exported to CSV / Excel spreadsheet format', 'info');
  };

  const handleExportPDF = () => {
    const headers = ['ID', 'Date', 'Tanker', 'Type', 'Vendor', 'Total Cost (₹)', 'Status'];
    const rows = maintenance.map((m) => [
      m.id,
      m.date,
      m.tankerNumber,
      m.type,
      m.vendor,
      m.totalCost,
      m.status,
    ]);
    exportToPdf('Fleet Maintenance Summary Report', headers, rows, 'Fleet_Maintenance_Report');
    showToast('Report Exported', 'PDF document compiled and download initiated', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Analytics & Executive Management Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Operational intelligence, cost distribution graphs, fleet health scores, and exportable audit reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300/60 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3 py-1.5 text-xs font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-300/60 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Maintenance Cost Distribution by Tanker (₹)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costByTankerData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="tanker" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="cost" fill="#1E3A8A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Work Order Type Split (Preventive vs Breakdown)
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
