import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Truck, ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound, Code2 } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
};

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // 3D tilt-on-hover for the sign-in card
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 180, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 180, damping: 20 });
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

      {/* Ambient floating gradient orbs */}
      <motion.div
        className="absolute -top-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-blue-600/25 blur-3xl pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-20 w-[30rem] h-[30rem] rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Top Bar */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -25, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
            className="w-10 h-10 rounded-xl bg-[#1E3A8A] border border-blue-500/30 flex items-center justify-center text-white shadow-lg"
          >
            <Truck className="w-6 h-6" />
          </motion.div>
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
      </motion.header>

      {/* Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4" style={{ perspective: 1200 }}>
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* Mouse-follow glow highlight */}
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glowX} ${glowY}, rgba(37,99,235,0.18), transparent 55%)`,
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ transform: 'translateZ(30px)' }}
          >
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.4, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.35 }}
                className="inline-flex p-3 rounded-2xl bg-blue-600/20 text-[#2563EB] mb-3 border border-blue-500/20"
              >
                <KeyRound className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-black text-white tracking-tight">System Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">Authenticate using Google Sheets User Master credentials</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  User ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. Admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm text-white placeholder-slate-600 transition-all"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
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
              </motion.div>

              {/* Remember Me & Forgot Password */}
              <motion.div variants={itemVariants} className="flex items-center justify-between text-xs">
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
              </motion.div>

              {/* Login Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02, boxShadow: '0 12px 30px -8px rgba(37,99,235,0.55)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1E3A8A] hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                    <span>Authenticating User...</span>
                  </>
                ) : (
                  <>
                    <span>Access Tanker Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full"
          >
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
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-3 px-6 border-t border-slate-900 bg-slate-950/90 text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 Piramal Petroleum Logistics & Fleet Operations. All Rights Reserved. Powered by Google Sheets API.</p>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
          <Code2 className="w-3 h-3" /> Developed by Deepak Sahu
        </p>
      </footer>
    </div>
  );
};
