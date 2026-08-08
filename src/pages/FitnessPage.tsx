import React, { useState } from 'react';
import { ComplianceFitness, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { FileCheck2, FileText } from 'lucide-react';

export const FitnessPage: React.FC<{ fitness?: ComplianceFitness[]; tankers?: Tanker[] }> = ({
  fitness = [],
  tankers = [],
}) => {
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  const columns: Column<ComplianceFitness>[] = [
    {
      header: 'Certificate No',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.certificateNumber}</span>,
      sortable: true,
      sortKey: 'certificateNumber',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Issue Date',
      accessor: (row) => <span className="font-mono text-slate-600 dark:text-slate-400">{row.issueDate}</span>,
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
      header: 'Certificate File',
      accessor: (row) => (
        <button
          onClick={() =>
            setPreviewDoc({
              title: `RTO Fitness Certificate - ${row.certificateNumber}`,
              url: row.documentUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            })
          }
          className="p-1.5 text-xs text-[#1E3A8A] font-bold hover:underline inline-flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> View Cert
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          RTO Vehicle Fitness Certificates
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Annual RTO fitness inspection certificates, calibration compliance, and expiry alerts
        </p>
      </div>

      <Table
        title="Fitness Certificate Ledger"
        columns={columns}
        data={fitness}
        searchPlaceholder="Search Certificate No, Tanker..."
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
