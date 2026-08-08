import React, { useState } from 'react';
import { ComplianceInsurance, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { ShieldCheck, FileText, Download } from 'lucide-react';

export const InsurancePage: React.FC<{ insurances?: ComplianceInsurance[]; tankers?: Tanker[] }> = ({
  insurances = [],
  tankers = [],
}) => {
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  const columns: Column<ComplianceInsurance>[] = [
    {
      header: 'Policy Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.policyNumber}</span>,
      sortable: true,
      sortKey: 'policyNumber',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Insurance Company',
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.company}</span>,
    },
    {
      header: 'Annual Premium',
      accessor: (row) => <span className="font-mono text-slate-800 dark:text-slate-200">₹{row.premium.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Start Date',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-400">{row.startDate}</span>,
    },
    {
      header: 'Expiry Date',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.expiryDate}</span>,
      sortable: true,
      sortKey: 'expiryDate',
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Document',
      accessor: (row) => (
        <button
          onClick={() =>
            setPreviewDoc({
              title: `Insurance Policy - ${row.policyNumber}`,
              url: row.documentUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            })
          }
          className="p-1.5 text-xs text-[#1E3A8A] font-bold hover:underline inline-flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> View Policy
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tanker Insurance Policy Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated 30-day expiry reminders, policy uploads, and comprehensive coverage tracking
          </p>
        </div>
      </div>

      <Table
        title="Insurance Policy Ledger"
        columns={columns}
        data={insurances}
        searchPlaceholder="Search Policy No, Tanker, Company..."
      />

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
