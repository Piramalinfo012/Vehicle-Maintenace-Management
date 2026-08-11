import React, { useState } from 'react';
import { Tanker, ComplianceInsurance, ComplianceFitness, CompliancePermit, CompliancePuc } from '../types';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { Modal } from '../components/common/Modal';
import { FileText, Eye, Search, ExternalLink, Car, ChevronRight } from 'lucide-react';

interface DocumentsPageProps {
  tankers?: Tanker[];
  insurances?: ComplianceInsurance[];
  fitness?: ComplianceFitness[];
  permits?: CompliancePermit[];
  pucs?: CompliancePuc[];
  documents?: any[];
  setDocuments?: React.Dispatch<React.SetStateAction<any[]>>;
}

// Indian vehicle registration number pattern, e.g. "CG04NK7192" or "CG 04 H 0667",
// as embedded at the start of the document name in the sheet.
const VEHICLE_NUMBER_REGEX = /^([A-Z]{2})\s?(\d{1,2})\s?([A-Z]{1,3})\s?(\d{1,4})/i;

function extractVehicleNumber(title: string): { key: string; label: string; rest: string } | null {
  const match = title.match(VEHICLE_NUMBER_REGEX);
  if (!match) return null;
  const [, state, rto, series, num] = match;
  const label = `${state.toUpperCase()}-${rto}-${series.toUpperCase()}-${num}`;
  const rest = title.slice(match[0].length).trim();
  return { key: label, label, rest };
}

// Formats an ISO date string (as stored in the sheet) to DD-MM-YYYY in IST.
function formatDateIST(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d
    .toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit', year: 'numeric' })
    .replace(/\//g, '-');
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents = [],
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroupLabel, setSelectedGroupLabel] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  // Live rows from the "Documents" sheet tab. Soft-deleted rows (Delete = "DELETED") are excluded.
  const allDocs = documents
    .filter((doc) => doc['Delete'] !== 'DELETED')
    .map((doc, i) => ({
      id: doc['Serial No'] || `DOC-${i}`,
      title: doc['Documne name'] || 'Untitled Document',
      category: doc['Category'] || 'Uncategorized',
      department: doc['Company/Department'] || '',
      needRenewal: doc['Need Renewal'] || '',
      renewalDate: doc['Renewal Date'] || '',
      url: doc['Image'] || '',
    }));

  // Group documents by the vehicle number embedded in their title.
  const UNASSIGNED_KEY = 'Other / Unassigned Documents';
  const groupsMap = new Map<string, { label: string; docs: (typeof allDocs[number] & { docType: string })[] }>();

  for (const doc of allDocs) {
    const parsed = extractVehicleNumber(doc.title);
    const key = parsed?.key || UNASSIGNED_KEY;
    const label = parsed?.label || UNASSIGNED_KEY;
    const docType = parsed?.rest || doc.department || doc.category;
    if (!groupsMap.has(key)) groupsMap.set(key, { label, docs: [] });
    groupsMap.get(key)!.docs.push({ ...doc, docType });
  }

  const groups = Array.from(groupsMap.values()).sort((a, b) => {
    if (a.label === UNASSIGNED_KEY) return 1;
    if (b.label === UNASSIGNED_KEY) return -1;
    return a.label.localeCompare(b.label);
  });

  const filteredGroups = groups.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.label.toLowerCase().includes(q) || g.docs.some((d) => d.title.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q));
  });

  const totalDocs = groups.reduce((sum, g) => sum + g.docs.length, 0);
  const selectedGroup = groups.find((g) => g.label === selectedGroupLabel) || null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Central Digital Document Repository
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {groups.length} vehicles, {totalDocs} documents - click a vehicle to view its documents
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicle number or document name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <button
            key={group.label}
            onClick={() => setSelectedGroupLabel(group.label)}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all flex items-center gap-3 text-left"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#1E3A8A] dark:text-blue-300 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-black font-mono text-slate-900 dark:text-white truncate">
                {group.label}
              </h3>
              <span className="text-[11px] text-slate-400">{group.docs.length} document{group.docs.length === 1 ? '' : 's'}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
          </button>
        ))}

        {filteredGroups.length === 0 && (
          <div className="col-span-full text-center py-16 text-xs text-slate-400">
            No vehicles match the current search.
          </div>
        )}
      </div>

      {/* Vehicle Documents Modal */}
      <Modal
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroupLabel(null)}
        title={selectedGroup?.label || ''}
        subtitle={selectedGroup ? `${selectedGroup.docs.length} document${selectedGroup.docs.length === 1 ? '' : 's'} on file` : ''}
        maxWidth="lg"
      >
        <div className="divide-y divide-slate-100 dark:divide-slate-800 -mx-1">
          {selectedGroup?.docs.map((doc, i) => (
            <div key={`${doc.id}-${i}`} className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {doc.docType || doc.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{doc.id}</span>
                    {doc.needRenewal === 'Yes' && doc.renewalDate && (
                      <span className="text-[10px] text-amber-600 font-semibold">Renew: {formatDateIST(doc.renewalDate)}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() =>
                    setPreviewDoc({
                      title: `${selectedGroup.label} - ${doc.docType || doc.title}`,
                      url: doc.url || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#1E3A8A] dark:text-blue-300 font-bold text-[11px] hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <a
                  href={doc.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  title="Open external link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Modal>

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
