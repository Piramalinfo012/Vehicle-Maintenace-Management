import React, { useState } from 'react';
import { Code2, Copy, Check, FileSpreadsheet, ExternalLink, Play, Server, ShieldCheck } from 'lucide-react';
import { googleAppsScriptCode } from '../services/googleSheetsScript';
import { useNotification } from '../context/NotificationContext';

export const GoogleAppsScriptPage: React.FC = () => {
  const { showToast } = useNotification();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopied(true);
    showToast('Code Copied to Clipboard', 'Paste this script into Extensions > Apps Script in Google Sheets', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Google Sheets Backend Integration & Apps Script Code
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deploy this Google Apps Script inside your Google Sheet to create a high-performance REST Web API for the Tanker Maintenance System
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-950/30 transition-all flex items-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied to Clipboard!' : 'Copy Apps Script Code'}
        </button>
      </div>

      {/* Deployment Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-black text-xs flex items-center justify-center">
            01
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-white">Create Google Sheet Master</h4>
          <p className="text-[11px] text-slate-500">
            Create tabs named <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">TankerMaster</code>,{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Maintenance</code>,{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">UserMaster</code>, and{' '}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">FuelLogs</code>.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-black text-xs flex items-center justify-center">
            02
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-white">Paste & Deploy Web App</h4>
          <p className="text-[11px] text-slate-500">
            Open <span className="font-bold text-slate-800 dark:text-slate-200">Extensions &gt; Apps Script</span>, paste the code below, and click <span className="font-bold text-slate-800 dark:text-slate-200">Deploy &gt; New deployment</span> as Web App.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-black text-xs flex items-center justify-center">
            03
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-white">Grant Access & Connect</h4>
          <p className="text-[11px] text-slate-500">
            Set access to <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">"Anyone"</span> and paste the generated Web App URL into System Settings.
          </p>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white text-xs">Code.gs (Google Apps Script Engine)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">JavaScript / Google Apps Script API</span>
        </div>

        <pre className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 text-[11px] leading-relaxed text-emerald-300/90 whitespace-pre">
          {googleAppsScriptCode}
        </pre>
      </div>
    </div>
  );
};
