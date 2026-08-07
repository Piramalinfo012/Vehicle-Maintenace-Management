import React, { useState } from 'react';
import { BatteryRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Battery, Plus } from 'lucide-react';

export const BatteryPage: React.FC<{ batteries: BatteryRecord[]; tankers: Tanker[] }> = ({
  batteries: initialBatteries,
  tankers,
}) => {
  const { showToast } = useNotification();
  const [batteryData, setBatteryData] = useState<BatteryRecord[]>(initialBatteries);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BatteryRecord>>({
    batteryNumber: `EXIDE-HD-${Math.floor(1000 + Math.random() * 9000)}`,
    brand: 'Exide Express Heavy',
    tankerNumber: tankers[0]?.tankerNumber || 'MH-04-FK-1201',
    purchaseDate: new Date().toISOString().slice(0, 10),
    warrantyMonths: 36,
    warrantyExpiry: '2027-08-01',
    replacementDue: '2027-08-01',
    status: 'Healthy',
  });

  const columns: Column<BatteryRecord>[] = [
    {
      header: 'Battery Serial No',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.batteryNumber}</span>,
      sortable: true,
      sortKey: 'batteryNumber',
    },
    {
      header: 'Brand',
      accessor: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200">{row.brand}</span>,
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Warranty (Months)',
      accessor: (row) => <span className="font-mono">{row.warrantyMonths} Months</span>,
    },
    {
      header: 'Warranty Expiry',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.warrantyExpiry}</span>,
    },
    {
      header: 'Replacement Due',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.replacementDue}</span>,
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
    const entry: BatteryRecord = {
      id: `BAT-${Date.now().toString().slice(-4)}`,
      batteryNumber: formData.batteryNumber || 'BAT-00',
      brand: formData.brand || 'Exide',
      tankerNumber: formData.tankerNumber || 'MH-04-FK-1201',
      purchaseDate: formData.purchaseDate || new Date().toISOString().slice(0, 10),
      warrantyMonths: Number(formData.warrantyMonths || 36),
      warrantyExpiry: formData.warrantyExpiry || '2027-08-01',
      replacementDue: formData.replacementDue || '2027-08-01',
      status: formData.status as any,
    };

    setBatteryData([entry, ...batteryData]);
    showToast('Battery Registered', `Serial #${entry.batteryNumber} registered for ${entry.tankerNumber}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Battery & Electrical Master Registry
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track battery warranty, installation date, voltage health, and replacement schedules
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Battery Unit
        </button>
      </div>

      <Table
        title="Heavy Vehicle Battery Inventory"
        columns={columns}
        data={batteryData}
        searchPlaceholder="Search Serial, Brand, Tanker..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Battery Unit"
        subtitle="Log new commercial heavy-duty battery unit details"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Battery Number *
              </label>
              <input
                type="text"
                required
                value={formData.batteryNumber}
                onChange={(e) => setFormData({ ...formData, batteryNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
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
                Warranty (Months)
              </label>
              <input
                type="number"
                value={formData.warrantyMonths}
                onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Warranty Expiry Date
              </label>
              <input
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Health Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              >
                <option value="Healthy">Healthy</option>
                <option value="Low Charge">Low Charge</option>
                <option value="Under Warranty">Under Warranty</option>
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
              Save Battery
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
