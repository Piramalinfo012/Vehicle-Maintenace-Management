import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'motion/react';
import { Truck, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('info@piramalpetroleum.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      showToast('Login Successful', 'Welcome to Tanker Maintenance Management System');
    } else {
      showToast('Login Failed', result.error, 'danger');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Reset Link Sent', `Password reset instructions sent to ${forgotEmail || email}`, 'info');
    setShowForgotModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Graphic Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=2000"
          alt="Tanker Fleet"
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] border border-blue-500/30 flex items-center justify-center text-white shadow-lg">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight">PIRAMAL PETROLEUM</h1>
            <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest">
              Tanker Maintenance Management System
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/50 text-blue-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Version v2.4.0 Enterprise
        </div>
      </header>

      {/* Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-blue-600/20 text-[#2563EB] mb-3 border border-blue-500/20">
              <KeyRound className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">System Sign In</h2>
            <p className="text-xs text-slate-400 mt-1">Authenticate using Google Sheets User Master credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@piramalpetroleum.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-white placeholder-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-white placeholder-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-[#2563EB] focus:ring-0"
                />
                Remember login
              </label>

              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-blue-400 font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating User...</span>
              ) : (
                <>
                  <span>Access Tanker Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
              Preset User Master Accounts
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { role: 'Admin', email: 'info@piramalpetroleum.com' },
                { role: 'Manager', email: 'manager@piramalpetroleum.com' },
                { role: 'Executive', email: 'executive@piramalpetroleum.com' },
                { role: 'Coordinator', email: 'coordinator@piramalpetroleum.com' },
                { role: 'Viewer', email: 'viewer@piramalpetroleum.com' },
              ].map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => setEmail(acc.email)}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 rounded-lg hover:border-blue-500 hover:text-white transition-all"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your registered corporate email to receive password recovery instructions.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@piramalpetroleum.com"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-3 px-6 border-t border-slate-900 bg-slate-950/90 text-center text-xs text-slate-500">
        © 2026 Piramal Petroleum Logistics & Fleet Operations. All Rights Reserved. Powered by Google Sheets API.
      </footer>
    </div>
  );
};
