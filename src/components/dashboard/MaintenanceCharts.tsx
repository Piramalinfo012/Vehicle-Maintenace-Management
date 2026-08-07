import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const MaintenanceCharts: React.FC = () => {
  const monthlyCostData = [
    { month: 'Mar', preventive: 45000, corrective: 28000, emergency: 12000, total: 85000 },
    { month: 'Apr', preventive: 52000, corrective: 35000, emergency: 18000, total: 105000 },
    { month: 'May', preventive: 48000, corrective: 22000, emergency: 9000, total: 79000 },
    { month: 'Jun', preventive: 60000, corrective: 41000, emergency: 25000, total: 126000 },
    { month: 'Jul', preventive: 55000, corrective: 30000, emergency: 14000, total: 99000 },
    { month: 'Aug', preventive: 68000, corrective: 42200, emergency: 14100, total: 124300 },
  ];

  const expenseCategoryData = [
    { name: 'Fuel', value: 325000, color: '#1E3A8A' },
    { name: 'Repair & Spares', value: 142200, color: '#2563EB' },
    { name: 'Tyres', value: 86500, color: '#0284C7' },
    { name: 'Insurance & Permits', value: 177000, color: '#16A34A' },
    { name: 'Battery', value: 38000, color: '#F59E0B' },
    { name: 'Misc', value: 24000, color: '#9333EA' },
  ];

  const fleetHealthData = [
    { category: 'Optimal Condition', count: 4 },
    { category: 'Minor Maintenance', count: 1 },
    { category: 'Major Overhaul', count: 1 },
    { category: 'Awaiting Compliance', count: 2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Maintenance Cost */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Monthly Maintenance Cost Breakdown (₹)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Preventive vs Corrective vs Emergency</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-[#1E3A8A] dark:text-indigo-300">
            2026 Fleet Trend
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyCostData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Cost']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="preventive" name="Preventive" fill="#16A34A" radius={[4, 4, 0, 0]} />
              <Bar dataKey="corrective" name="Corrective" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emergency" name="Emergency" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Category Distribution */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Fleet Expense Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Categorized operational expenditure</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            Current Quarter
          </span>
        </div>

        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {expenseCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yearly Maintenance Trend */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Yearly Maintenance Spend Curve
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative expenditure trajectory</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyCostData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Total Spend']} />
              <Area type="monotone" dataKey="total" stroke="#1E3A8A" strokeWidth={2.5} fillOpacity={1} fill="url(#costGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fleet Health Overview */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Vehicle Health Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Diagnostic health metric classification</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={fleetHealthData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
