import React, { useState } from 'react';
import { CompliancePermit, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { FileBadge, FileText } from 'lucide-react';

export const PermitPage: React.FC<{ permits?: CompliancePermit[]; tankers?: Tanker[] }> = ({
  permits = [],
  tankers = [],
}) => {
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  const columns: Column<CompliancePermit>[] = [
    {
      header: 'Permit Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.permitNumber}</span>,
      sortable: true,
      sortKey: 'permitNumber',
    },
    {
      header: 'Permit Type',
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.permitType}</span>,
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
      header: 'Document',
      accessor: (row) => (
        <button
          onClick={() =>
            setPreviewDoc({
              title: `Permit Document - ${row.permitNumber}`,
              url: row.documentUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            })
          }
          className="p-1.5 text-xs text-[#1E3A8A] font-bold hover:underline inline-flex items-center gap-1"
        >
          <FileText className="w-3.5 h-3.5" /> View Permit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          National & Hazardous Material Permits
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          National permits, state transit authorization, and petroleum/chemical hazardous goods clearance certificates
        </p>
      </div>

      <Table
        title="Transport Permit Master"
        columns={columns}
        data={permits}
        searchPlaceholder="Search Permit No, Type, Tanker..."
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
