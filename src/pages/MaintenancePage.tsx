import React, { useState } from 'react';
import { MaintenanceRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { MaintenanceModal } from '../components/maintenance/MaintenanceModal';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Wrench, Eye, Edit2, Calendar, DollarSign, Building } from 'lucide-react';

interface MaintenancePageProps {
  maintenance: MaintenanceRecord[];
  tankers: Tanker[];
  onAddMaintenance: (record: Partial<MaintenanceRecord>) => void;
  onUpdateMaintenance: (id: string, record: Partial<MaintenanceRecord>) => void;
  initialFilterTanker?: string;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  maintenance,
  tankers,
  onAddMaintenance,
  onUpdateMaintenance,
  initialFilterTanker,
}) => {
  const { hasPermission } = useAuth();
  const { showToast } = useNotification();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  const [viewDetailRecord, setViewDetailRecord] = useState<MaintenanceRecord | null>(null);

  const filteredData = maintenance.filter((rec) => {
    if (initialFilterTanker && rec.tankerNumber !== initialFilterTanker) return false;
    if (selectedType !== 'All' && rec.type !== selectedType) return false;
    if (selectedStatus !== 'All' && rec.status !== selectedStatus) return false;
    return true;
  });

  const columns: Column<MaintenanceRecord>[] = [
    {
      header: 'Ticket ID / Date',
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white font-mono">{row.id}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.date}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white font-mono">{row.tankerNumber}</span>,
      sortable: true,
      sortKey: 'tankerNumber',
    },
    {
      header: 'Type',
      accessor: (row) => <Badge status={row.type} size="sm" />,
    },
    {
      header: 'Vendor & Complaint',
      accessor: (row) => (
        <div className="max-w-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{row.vendor}</div>
          <div className="text-[11px] text-slate-500 truncate">{row.complaint}</div>
        </div>
      ),
    },
    {
      header: 'Total Cost',
      accessor: (row) => <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">₹{row.totalCost.toLocaleString('en-IN')}</span>,
      sortable: true,
      sortKey: 'totalCost',
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewDetailRecord(row)}
            className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            title="View Full Ticket Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {hasPermission('canManageMaintenance') && (
            <button
              onClick={() => {
                setEditingRecord(row);
                setIsModalOpen(true);
              }}
              className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
              title="Edit Ticket"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Maintenance & Service Work Orders
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log preventive maintenance schedules, emergency repairs, parts itemization, and vendor invoicing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Corrective">Corrective</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
          </select>

          {hasPermission('canManageMaintenance') && (
            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all"
            >
              + Create Maintenance Ticket
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <Table
        title="Maintenance Work Orders"
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search by ID, Tanker Number, Vendor, Complaint..."
      />

      {/* Maintenance Modal */}
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (editingRecord) {
            onUpdateMaintenance(editingRecord.id, data);
            showToast('Ticket Updated', `Work Order ${editingRecord.id} updated successfully`);
          } else {
            onAddMaintenance(data);
            showToast('Ticket Created', `New Work Order generated`);
          }
        }}
        tankers={tankers}
        initialData={editingRecord}
      />

      {/* View Detail Modal */}
      {viewDetailRecord && (
        <Modal
          isOpen={Boolean(viewDetailRecord)}
          onClose={() => setViewDetailRecord(null)}
          title={`Work Order Ticket ${viewDetailRecord.id}`}
          subtitle={`Tanker Asset: ${viewDetailRecord.tankerNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Status</span>
                <Badge status={viewDetailRecord.status} />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Type</span>
                <Badge status={viewDetailRecord.type} />
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{viewDetailRecord.date}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Odometer</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{viewDetailRecord.currentKm.toLocaleString('en-IN')} KM</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Vendor / Workshop</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{viewDetailRecord.vendor}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">Complaint / Reported Issue:</h4>
              <p className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                {viewDetailRecord.complaint}
              </p>
            </div>

            {viewDetailRecord.workDescription && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Technician Work Executed:</h4>
                <p className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                  {viewDetailRecord.workDescription}
                </p>
              </div>
            )}

            {viewDetailRecord.spareParts && viewDetailRecord.spareParts.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Spare Parts Itemization:</h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                      <tr>
                        <th className="p-2">Part Name</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-right">Unit Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {viewDetailRecord.spareParts.map((sp, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium">{sp.partName}</td>
                          <td className="p-2 text-center font-mono">{sp.quantity}</td>
                          <td className="p-2 text-right font-mono">₹{sp.unitPrice.toLocaleString('en-IN')}</td>
                          <td className="p-2 text-right font-mono font-bold">₹{sp.total.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="p-4 bg-[#1E3A8A] text-white rounded-xl flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-xs">Total Ticket Cost</span>
              <span className="text-xl font-black font-mono">₹{viewDetailRecord.totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
