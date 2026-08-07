import React, { useState } from 'react';
import { TyreRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Disc, Plus } from 'lucide-react';

export const TyresPage: React.FC<{ tyres: TyreRecord[]; tankers: Tanker[] }> = ({
  tyres: initialTyres,
  tankers,
}) => {
  const { showToast } = useNotification();
  const [tyresData, setTyresData] = useState<TyreRecord[]>(initialTyres);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<TyreRecord>>({
    tyreNumber: `MRF-RAD-${Math.floor(10000 + Math.random() * 90000)}`,
    brand: 'MRF Super Lug',
    purchaseDate: new Date().toISOString().slice(0, 10),
    purchaseCost: 28000,
    installedPosition: 'Front Left',
    currentPosition: 'Front Left',
    tankerNumber: tankers[0]?.tankerNumber || 'MH-04-FK-1201',
    runningKm: 12000,
    replacementDueKm: 80000,
    status: 'Good',
  });

  const columns: Column<TyreRecord>[] = [
    {
      header: 'Tyre Serial No',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tyreNumber}</span>,
      sortable: true,
      sortKey: 'tyreNumber',
    },
    {
      header: 'Brand',
      accessor: (row) => <span className="font-medium text-slate-800 dark:text-slate-200">{row.brand}</span>,
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Position',
      accessor: (row) => <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-[11px]">{row.installedPosition}</span>,
    },
    {
      header: 'Running KM / Threshold',
      accessor: (row) => (
        <div>
          <div className="font-bold font-mono">{row.runningKm.toLocaleString('en-IN')} KM</div>
          <div className="text-[10px] text-slate-400 font-mono">Due at: {row.replacementDueKm.toLocaleString('en-IN')} KM</div>
        </div>
      ),
      sortable: true,
      sortKey: 'runningKm',
    },
    {
      header: 'Purchase Cost',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">₹{row.purchaseCost.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
      sortable: true,
      sortKey: 'status',
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: TyreRecord = {
      id: `TYR-${Date.now().toString().slice(-4)}`,
      tyreNumber: formData.tyreNumber || 'TYR-00',
      brand: formData.brand || 'MRF',
      purchaseDate: formData.purchaseDate || new Date().toISOString().slice(0, 10),
      purchaseCost: Number(formData.purchaseCost || 0),
      installedPosition: formData.installedPosition as any,
      currentPosition: formData.installedPosition || 'Front Left',
      tankerNumber: formData.tankerNumber || 'MH-04-FK-1201',
      runningKm: Number(formData.runningKm || 0),
      replacementDueKm: Number(formData.replacementDueKm || 80000),
      status: formData.status as any,
    };

    setTyresData([entry, ...tyresData]);
    showToast('Tyre Registered', `Serial #${entry.tyreNumber} assigned to ${entry.tankerNumber}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tyre Life Cycle & Position Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor running mileage, axle placement, rotation schedules, and wear alerts
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Tyre Record
        </button>
      </div>

      <Table
        title="Tyre Inventory & Mounted Position Master"
        columns={columns}
        data={tyresData}
        searchPlaceholder="Search Tyre Serial, Brand, Tanker..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Tyre Asset"
        subtitle="Log new tyre purchase, brand specs, and mounted axle position"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Tyre Number / Serial *
              </label>
              <input
                type="text"
                required
                value={formData.tyreNumber}
                onChange={(e) => setFormData({ ...formData, tyreNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Brand Name *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. MRF / Apollo / JK Tyre"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Mounted Tanker *
              </label>
              <select
                value={formData.tankerNumber}
                onChange={(e) => setFormData({ ...formData, tankerNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              >
                {tankers.map((t) => (
                  <option key={t.id} value={t.tankerNumber}>
                    {t.tankerNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Installed Position
              </label>
              <select
                value={formData.installedPosition}
                onChange={(e) => setFormData({ ...formData, installedPosition: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              >
                <option value="Front Left">Front Left</option>
                <option value="Front Right">Front Right</option>
                <option value="Rear Outer Left">Rear Outer Left</option>
                <option value="Rear Inner Left">Rear Inner Left</option>
                <option value="Rear Outer Right">Rear Outer Right</option>
                <option value="Rear Inner Right">Rear Inner Right</option>
                <option value="Spare">Spare Tyre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Purchase Cost (₹)
              </label>
              <input
                type="number"
                value={formData.purchaseCost}
                onChange={(e) => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              >
                <option value="Good">Good</option>
                <option value="Needs Rotation">Needs Rotation</option>
                <option value="Worn Out">Worn Out</option>
                <option value="Replaced">Replaced</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold bg-white border rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] rounded-lg">
              Save Tyre Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
