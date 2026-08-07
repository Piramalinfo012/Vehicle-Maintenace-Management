import React, { useState } from 'react';
import { Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { TankerModal } from '../components/tankers/TankerModal';
import { DocumentPreviewModal } from '../components/common/DocumentPreviewModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Truck,
  Grid,
  List,
  Eye,
  Edit2,
  Trash2,
  FileText,
  MapPin,
  User,
  ShieldCheck,
  Fuel,
} from 'lucide-react';

interface TankerMasterPageProps {
  tankers: Tanker[];
  onAddTanker: (tanker: Partial<Tanker>) => void;
  onUpdateTanker: (id: string, tanker: Partial<Tanker>) => void;
  onDeleteTanker: (id: string) => void;
  onViewServiceHistory: (tankerNumber: string) => void;
}

export const TankerMasterPage: React.FC<TankerMasterPageProps> = ({
  tankers,
  onAddTanker,
  onUpdateTanker,
  onDeleteTanker,
  onViewServiceHistory,
}) => {
  const { hasPermission } = useAuth();
  const { showToast } = useNotification();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTanker, setEditingTanker] = useState<Tanker | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [previewDoc, setPreviewDoc] = useState<{ title: string; url?: string } | null>(null);

  const filteredTankers = tankers.filter((t) => {
    if (selectedStatus === 'All') return true;
    return t.status === selectedStatus;
  });

  const columns: Column<Tanker>[] = [
    {
      header: 'Tanker No / Reg',
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white font-mono">{row.tankerNumber}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.registrationNumber}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'tankerNumber',
    },
    {
      header: 'Type & Capacity',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{row.vehicleType}</div>
          <div className="text-[11px] text-slate-500">{row.capacity}</div>
        </div>
      ),
    },
    {
      header: 'Specs / Model',
      accessor: (row) => (
        <div>
          <div className="text-slate-800 dark:text-slate-200">{row.manufacturer}</div>
          <div className="text-[10px] text-slate-500">{row.model}</div>
        </div>
      ),
    },
    {
      header: 'Current Odometer',
      accessor: (row) => <span className="font-mono text-xs">{row.currentKm.toLocaleString('en-IN')} KM</span>,
      sortable: true,
      sortKey: 'currentKm',
    },
    {
      header: 'Driver & Location',
      accessor: (row) => (
        <div>
          <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium">
            <User className="w-3 h-3 text-slate-400" /> {row.driver}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400" /> {row.location}
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} />,
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingTanker(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="Edit Asset Details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onViewServiceHistory(row.tankerNumber)}
            className="p-1.5 text-slate-600 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            title="View Service History"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {hasPermission('canManageTankers') && (
            <button
              onClick={() => setDeletingId(row.id)}
              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg"
              title="Delete Tanker Asset"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Vehicle & Director Fleet Master Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Central repository for director cars, executive SUVs, company sedans, and heavy transport tankers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter Pill */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm text-xs">
            {['All', 'Available', 'Under Maintenance', 'Breakdown', 'In Transit'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  selectedStatus === st
                    ? 'bg-[#1E3A8A] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#1E3A8A] text-white' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-[#1E3A8A] text-white' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTanker(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>+</span> Add New Vehicle / Car
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'table' ? (
        <Table
          title="Vehicle & Fleet Master Records"
          columns={columns}
          data={filteredTankers}
          searchPlaceholder="Search by Vehicle Number, Director/Driver, Model, Location..."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTankers.map((tanker) => (
            <div
              key={tanker.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Photo Banner */}
              <div className="h-44 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                <img
                  src={
                    tanker.photoUrl ||
                    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800'
                  }
                  alt={tanker.tankerNumber}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge status={tanker.status} size="md" />
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-xs font-mono font-bold backdrop-blur-md">
                  {tanker.capacity}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">
                        {tanker.tankerNumber}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">{tanker.registrationNumber}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-[#1E3A8A] dark:text-indigo-300 text-[10px] font-bold">
                      {tanker.vehicleType}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs border-t border-b border-slate-100 dark:border-slate-800 py-3">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Manufacturer</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{tanker.manufacturer}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Odometer Reading</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {tanker.currentKm.toLocaleString('en-IN')} KM
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Driver</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{tanker.driver}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Depot</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{tanker.location}</span>
                    </div>
                  </div>

                  {tanker.remarks && (
                    <p className="mt-3 text-xs text-slate-500 italic line-clamp-1">"{tanker.remarks}"</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        setPreviewDoc({
                          title: `RC File - ${tanker.tankerNumber}`,
                          url: tanker.rcDocumentUrl,
                        })
                      }
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 text-[10px] font-bold inline-flex items-center gap-1"
                      title="Preview RC Document"
                    >
                      <FileText className="w-3.5 h-3.5" /> RC
                    </button>

                    <button
                      onClick={() => onViewServiceHistory(tanker.tankerNumber)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#1E3A8A] dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Service Log
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTanker(tanker);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {hasPermission('canManageTankers') && (
                      <button
                        onClick={() => setDeletingId(tanker.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <TankerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          if (editingTanker) {
            onUpdateTanker(editingTanker.id, data);
            showToast('Tanker Updated', `Asset ${data.tankerNumber} updated successfully`);
          } else {
            onAddTanker(data);
            showToast('Tanker Added', `New asset ${data.tankerNumber} registered in Master`);
          }
        }}
        initialData={editingTanker}
      />

      {/* Document Previewer Modal */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          documentTitle={previewDoc.title}
          documentUrl={previewDoc.url}
        />
      )}

      {/* Delete Confirmation */}
      {deletingId && (
        <ConfirmDialog
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          onConfirm={() => {
            onDeleteTanker(deletingId);
            showToast('Tanker Removed', 'Asset removed from master registry', 'danger');
          }}
          title="Delete Tanker Asset"
          message="Are you sure you want to permanently delete this tanker asset record from the system?"
          confirmLabel="Delete Asset"
          isDanger
        />
      )}
    </div>
  );
};
