import React, { useState } from 'react';
import { CompliancePuc, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { Leaf, FileText } from 'lucide-react';

export const PucPage: React.FC<{ pucs: CompliancePuc[]; tankers: Tanker[] }> = ({
  pucs,
}) => {
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  const columns: Column<CompliancePuc>[] = [
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
      header: 'Pollution Doc',
      accessor: (row) => (
        <button
          onClick={() =>
            setPreviewDoc({
              title: `PUC Certificate - ${row.certificateNumber}`,
              url: row.documentUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            })
          }
          className="p-1.5 text-xs text-[#1E3A8A] font-bold hover:underline inline-flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> View PUC
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Pollution Under Control (PUC) Certificates
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Quarterly emission compliance certificates and green clearance logs
        </p>
      </div>

      <Table
        title="PUC Emission Compliance Records"
        columns={columns}
        data={pucs}
        searchPlaceholder="Search PUC Cert No, Tanker..."
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
