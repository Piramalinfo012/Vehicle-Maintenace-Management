import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NotificationItem } from '../../types';
import {
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ChevronDown,
  Truck,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  onNavigate: (view: string) => void;
  onToggleMobileMenu?: () => void;
  notifications?: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  globalSearchQuery,
  setGlobalSearchQuery,
  onNavigate,
  onToggleMobileMenu,
  notifications = [],
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-all shadow-xs">
      {/* Mobile Hamburger Menu Toggle */}
      <button
        onClick={onToggleMobileMenu}
        className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors shrink-0 border border-slate-200/60 dark:border-slate-700/60"
        aria-label="Open Navigation Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-md min-w-0">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Global Search (Vehicle #, Director Car, Vendor, Doc)..."
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 transition-all truncate shadow-inner"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Compliance Notifications
                </h4>
                <button
                  onClick={() => {
                    onNavigate('Reminders');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs text-[#1E3A8A] dark:text-blue-400 font-semibold hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 && (
                  <div className="p-4 text-xs text-slate-400 text-center">No active compliance alerts</div>
                )}
                {notifications.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onNavigate('Reminders');
                      setShowNotifMenu(false);
                    }}
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      !item.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.date.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{item.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                        {item.tankerNumber}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{user?.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email || `User ID: ${user?.id}`}</p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-[#1E3A8A] dark:text-indigo-300 text-[10px] font-bold rounded">
                  {user?.department || user?.role}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('Settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-slate-400" /> System Settings
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
