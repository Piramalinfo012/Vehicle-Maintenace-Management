import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  Truck,
  Wrench,
  Fuel,
  Disc,
  Battery,
  ShieldCheck,
  FileCheck2,
  FileBadge,
  Sparkles,
  FileText,
  History,
  DollarSign,
  AlertTriangle,
  Bell,
  BarChart3,
  Users,
  Settings,
  Code2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  breakdownCount?: number;
  maintenanceCount?: number;
  reminderCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  setCollapsed,
  breakdownCount = 1,
  maintenanceCount = 1,
  reminderCount = 3,
}) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Tanker Master', label: 'Vehicle Master', icon: Car },
    { id: 'Service History', label: 'Service Tracking & Schedule', icon: History },
    { id: 'Maintenance', label: 'Work Orders', icon: Wrench, badge: maintenanceCount },
    { id: 'Fuel', label: 'Fuel Logs', icon: Fuel },
    { id: 'Documents', label: 'Documents & Permits', icon: FileText },
    { id: 'Expense', label: 'Expense Mgmt', icon: DollarSign },
    { id: 'Breakdown', label: 'Breakdowns', icon: AlertTriangle, badge: breakdownCount, isDanger: true },
    { id: 'Reminders', label: 'Reminders & Alerts', icon: Bell, badge: reminderCount },
    { id: 'Reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'Users', label: 'Users & Roles', icon: Users },
    { id: 'Settings', label: 'System Settings', icon: Settings },
    { id: 'Google Apps Script', label: 'Google Sheets API', icon: Code2 },
  ];

  return (
    <aside
      className={`relative z-40 bg-[#1E3A8A] text-white flex flex-col transition-all duration-300 shadow-xl select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-blue-900/60 bg-blue-950/40">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-inner">
            <Car className="w-6 h-6 text-blue-300" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-extrabold text-sm tracking-tight text-white truncate leading-tight">
                VEHICLE FLEET
              </h1>
              <p className="text-[10px] text-blue-200/80 font-medium tracking-wide uppercase">
                Vehicle Maintenance
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1 scrollbar-thin scrollbar-thumb-blue-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-blue-100/80 hover:bg-blue-800/50 hover:text-white'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-blue-300/80'
                  }`}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.isDanger ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info / Logout Footer */}
      <div className="p-3 border-t border-blue-900/60 bg-blue-950/60">
        {!collapsed && (
          <div className="mb-2 px-2 py-1.5 bg-blue-900/40 rounded-lg flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-blue-300">System Role</p>
              <p className="text-xs font-bold text-white truncate">{user?.role}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-900/40 hover:text-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
