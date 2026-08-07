import React, { useState } from 'react';
import { MaintenanceRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { DollarSign, PieChart, TrendingUp, Filter, Calendar } from 'lucide-react';

interface ExpensePageProps {
  maintenance: MaintenanceRecord[];
  tankers: Tanker[];
}

export const ExpensePage: React.FC<ExpensePageProps> = ({ maintenance = [], tankers = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('All');

  // Compute total expenditure metrics
  const totalMaintenanceCost = maintenance.reduce((sum, m) => sum + (m.totalCost || 0), 0);
  const totalMaterialCost = maintenance.reduce((sum, m) => sum + (m.materialCost || 0), 0);
  const totalLabourCost = maintenance.reduce((sum, m) => sum + (m.labourCost || 0), 0);

  const expenseItems = maintenance.map((m) => ({
    id: m.id,
    date: m.date,
    tankerNumber: m.tankerNumber,
    category: m.type === 'Preventive' ? 'Routine Maintenance' : 'Repair & Breakdown',
    vendor: m.vendor,
    materialCost: m.materialCost,
    labourCost: m.labourCost,
    otherCost: m.otherCost,
    totalCost: m.totalCost,
  }));

  const columns: Column<typeof expenseItems[0]>[] = [
    {
      header: 'Voucher / Date',
      accessor: (row) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.date}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Category',
      accessor: (row) => <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-bold text-[11px]">{row.category}</span>,
    },
    {
      header: 'Vendor / Payee',
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.vendor}</span>,
    },
    {
      header: 'Material (₹)',
      accessor: (row) => <span className="font-mono">₹{row.materialCost.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Labour (₹)',
      accessor: (row) => <span className="font-mono">₹{row.labourCost.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Total Cost',
      accessor: (row) => (
        <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
          ₹{row.totalCost.toLocaleString('en-IN')}
        </span>
      ),
      sortable: true,
      sortKey: 'totalCost',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Fleet Financial & Expense Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Consolidated ledger of spare parts purchasing, workshop labor fees, fuel, and compliance fees
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Workshop Expense</p>
            <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
              ₹{totalMaintenanceCost.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Spare Parts Expenditure</p>
            <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
              ₹{totalMaterialCost.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Technician Labour Fees</p>
            <p className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1">
              ₹{totalLabourCost.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      <Table
        title="Expense Voucher Ledger"
        columns={columns}
        data={expenseItems}
        searchPlaceholder="Search Voucher ID, Tanker Number, Vendor..."
      />
    </div>
  );
};
