import React, { useState } from 'react';
import { Tanker, ComplianceInsurance, ComplianceFitness, CompliancePermit, CompliancePuc } from '../types';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { FileText, Download, Eye, Search, Filter, Folder, ExternalLink } from 'lucide-react';

interface DocumentsPageProps {
  tankers?: Tanker[];
  insurances?: ComplianceInsurance[];
  fitness?: ComplianceFitness[];
  permits?: CompliancePermit[];
  pucs?: CompliancePuc[];
  documents?: any[];
  setDocuments?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  tankers = [],
  insurances = [],
  fitness = [],
  permits = [],
  pucs = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTanker, setSelectedTanker] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  // Consolidate all documents into a unified list
  const allDocs = [
    ...(tankers || []).map((t) => ({
      id: `RC-${t.id}`,
      title: `Registration Certificate (RC) - ${t.tankerNumber}`,
      category: 'Registration Certificate (RC)',
      tankerNumber: t.tankerNumber,
      expiryDate: '31-12-2030',
      url: t.rcDocumentUrl,
    })),
    ...(insurances || []).map((i) => ({
      id: `INS-${i.id}`,
      title: `Insurance Policy ${i.policyNumber}`,
      category: 'Insurance Policy',
      tankerNumber: i.tankerNumber,
      expiryDate: i.expiryDate,
      url: i.documentUrl,
    })),
    ...(fitness || []).map((f) => ({
      id: `FIT-${f.id}`,
      title: `RTO Fitness Certificate ${f.certificateNumber}`,
      category: 'Fitness Certificate',
      tankerNumber: f.tankerNumber,
      expiryDate: f.expiryDate,
      url: f.documentUrl,
    })),
    ...(permits || []).map((p) => ({
      id: `PER-${p.id}`,
      title: `${p.permitType} ${p.permitNumber}`,
      category: 'National / Goods Permit',
      tankerNumber: p.tankerNumber,
      expiryDate: p.expiryDate,
      url: p.documentUrl,
    })),
    ...(pucs || []).map((u) => ({
      id: `PUC-${u.id}`,
      title: `PUC Emission Cert ${u.certificateNumber}`,
      category: 'PUC Pollution Certificate',
      tankerNumber: u.tankerNumber,
      expiryDate: u.expiryDate,
      url: u.documentUrl,
    })),
  ];

  const filteredDocs = allDocs.filter((doc) => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (selectedTanker !== 'All' && doc.tankerNumber !== selectedTanker) return false;
    if (
      searchQuery &&
      !doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !doc.tankerNumber.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Central Digital Document Repository
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cloud repository for all fleet RCs, insurance policies, permits, fitness, and PUC digital scans
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search document title, certificate ID, tanker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
          >
            <option value="All">All Document Categories</option>
            <option value="Registration Certificate (RC)">Registration Certificate (RC)</option>
            <option value="Insurance Policy">Insurance Policy</option>
            <option value="Fitness Certificate">Fitness Certificate</option>
            <option value="National / Goods Permit">National / Goods Permit</option>
            <option value="PUC Pollution Certificate">PUC Pollution Certificate</option>
          </select>

          <select
            value={selectedTanker}
            onChange={(e) => setSelectedTanker(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
          >
            <option value="All">All Tankers</option>
            {tankers.map((t) => (
              <option key={t.id} value={t.tankerNumber}>
                {t.tankerNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#1E3A8A] dark:text-blue-300 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {doc.category}
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] font-bold text-slate-800 dark:text-slate-200">
                    {doc.tankerNumber}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Exp: {doc.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() =>
                  setPreviewDoc({
                    title: doc.title,
                    url: doc.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Preview Scan
              </button>

              <a
                href={doc.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Download / Open external link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {previewDoc && (
        <DocumentPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          documentTitle={previewDoc.title}
          documentUrl={previewDoc.url}
        />
      )}
    </div>
  );
};
