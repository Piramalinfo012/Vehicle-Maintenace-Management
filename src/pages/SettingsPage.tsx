import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Database, Bell, Lock, RefreshCw } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { showToast } = useNotification();
  const { darkMode, toggleDarkMode } = useTheme();

  const [companyName, setCompanyName] = useState('Piramal Petroleum Logistics Pvt. Ltd.');
  const [currencySymbol, setCurrencySymbol] = useState('₹ (INR)');
  const [autoReminderDays, setAutoReminderDays] = useState('15');
  const [googleSheetAppUrl, setGoogleSheetAppUrl] = useState(
    'https://script.google.com/macros/s/AKfycbx_Piramal_Tanker_Maintenance_v2_API/exec'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Persisted', 'System configuration and preferences saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          System Administration & Global Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure enterprise parameters, Google Sheet endpoints, auto-alert thresholds, and theme settings
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Settings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Enterprise Branding & Locale
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Organization Entity Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Currency Notation
              </label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" /> Primary Google Apps Script Endpoint
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
              Google Sheet Web App URL
            </label>
            <input
              type="text"
              value={googleSheetAppUrl}
              onChange={(e) => setGoogleSheetAppUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono text-slate-800 dark:text-slate-200"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              All CRUD write operations to Tanker Master, Maintenance, Fuel & Compliance sheets use this deployment.
            </p>
          </div>
        </div>

        {/* Alert Thresholds */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> Compliance Notification Engine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Advance Expiry Warning Window (Days)
              </label>
              <input
                type="number"
                value={autoReminderDays}
                onChange={(e) => setAutoReminderDays(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl font-mono font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Triggers visual warning badges on Dashboard and Reminders tab when Fitness, Insurance, or Permits expire within this timeframe.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Visual UI Interface Mode
              </label>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {darkMode ? 'Dark Mode (SAP / Oracle Luxury Slate)' : 'Light Mode (Enterprise Standard)'}
                </span>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="px-3 py-1 text-xs font-bold bg-[#1E3A8A] text-white rounded-lg shadow-sm"
                >
                  Switch Mode
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-xl shadow-md shadow-blue-950/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save System Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
