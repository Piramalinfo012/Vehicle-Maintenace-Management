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
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  breakdownCount?: number;
  maintenanceCount?: number;
  reminderCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
  breakdownCount = 1,
  maintenanceCount = 1,
  reminderCount = 3,
}) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Tanker Master', label: 'Vehicle Master', icon: Car },
    { id: 'Service History', label: 'Service Tracking & Schedule', icon: History },
    { id: 'Documents', label: 'Documents & Permits', icon: FileText },
    { id: 'Expense', label: 'Expense Mgmt', icon: DollarSign },
    { id: 'Breakdown', label: 'Breakdowns', icon: AlertTriangle, badge: breakdownCount, isDanger: true },
    { id: 'Reminders', label: 'Reminders & Alerts', icon: Bell, badge: reminderCount },
    { id: 'Reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'Users', label: 'Users & Roles', icon: Users },
    { id: 'Settings', label: 'System Settings', icon: Settings },
    { id: 'Google Apps Script', label: 'Google Sheets API', icon: Code2 },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#0B132B] text-white flex flex-col transition-all duration-300 shadow-2xl border-r border-slate-800/80 select-none ${
          /* Mobile Drawer Position */
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${
          /* Desktop Width */
          collapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md transition-all ${
            collapsed && !mobileOpen ? 'px-2' : 'px-4'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`${
                collapsed && !mobileOpen ? 'w-9 h-9' : 'w-10 h-10'
              } rounded-xl bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border border-blue-400/30 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10`}
            >
              <Car className={`${collapsed && !mobileOpen ? 'w-5 h-5' : 'w-6 h-6'} text-blue-400`} />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <h1 className="font-extrabold text-sm tracking-tight text-white truncate leading-tight font-display">
                  VEHICLE FLEET
                </h1>
                <p className="text-[10px] text-blue-400/90 font-semibold tracking-wider uppercase truncate">
                  Enterprise Maintenance
                </p>
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors shrink-0 ${
              collapsed && !mobileOpen ? 'p-1' : 'p-1.5'
            }`}
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen && setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1.5 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isLabelVisible = !collapsed || mobileOpen;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center ${
                  !isLabelVisible ? 'justify-center px-2' : 'justify-between px-3'
                } py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
                title={!isLabelVisible ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-300 rounded-r-full shadow-glow" />
                )}
                <div className={`flex items-center ${!isLabelVisible ? 'justify-center' : 'gap-3'} min-w-0`}>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                    }`}
                  />
                  {isLabelVisible && <span className="truncate">{item.label}</span>}
                </div>

                {isLabelVisible && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                      item.isDanger
                        ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/30'
                        : 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
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
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
          {(!collapsed || mobileOpen) && (
            <div className="mb-2 px-2.5 py-1.5 bg-slate-900/80 border border-slate-800/80 rounded-xl flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">System Role</p>
                <p className="text-xs font-bold text-white truncate">{user?.role}</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-emerald-400/20" />
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/50 hover:text-rose-100 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
