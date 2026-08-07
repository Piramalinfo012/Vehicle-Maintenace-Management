import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { MaintenanceRecord, Tanker, SparePartItem, MaintenanceType, MaintenanceStatus } from '../../types';
import { Plus, Trash2, Calculator } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Partial<MaintenanceRecord>) => void;
  tankers: Tanker[];
  initialData?: MaintenanceRecord | null;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tankers,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    date: new Date().toISOString().slice(0, 10),
    tankerNumber: tankers[0]?.tankerNumber || '',
    tankerId: tankers[0]?.id || '',
    currentKm: tankers[0]?.currentKm || 120000,
    type: 'Preventive',
    vendor: 'Ashok Leyland Service Center',
    workshop: 'Bay 1 Main Workshop',
    complaint: '',
    workDescription: '',
    spareParts: [],
    labourCost: 3500,
    materialCost: 0,
    otherCost: 500,
    totalCost: 4000,
    expectedCompletion: new Date().toISOString().slice(0, 10),
    status: 'Running',
    remarks: '',
  });

  const [parts, setParts] = useState<SparePartItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setParts(initialData.spareParts || []);
    } else {
      const defaultTanker = tankers[0] || { tankerNumber: 'MH-04-FK-1201', id: 'TNK-001', currentKm: 142000 };
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        tankerNumber: defaultTanker.tankerNumber,
        tankerId: defaultTanker.id,
        currentKm: defaultTanker.currentKm,
        type: 'Preventive',
        vendor: 'BharatBenz Authorized Works',
        workshop: 'Bay 2 Mechanical Section',
        complaint: 'Routine 10,000 KM service, oil filter check, valve pressure test',
        workDescription: 'Replaced oil filter, engine synthetic oil, calibrated discharge valves.',
        labourCost: 4500,
        materialCost: 8500,
        otherCost: 1000,
        totalCost: 14000,
        expectedCompletion: new Date().toISOString().slice(0, 10),
        status: 'Running',
        remarks: 'Tanker expected ready for dispatch by end of day.',
      });
      setParts([
        { id: '1', partName: 'Engine Synthetic Oil 15W40 (20L)', quantity: 1, unitPrice: 6500, total: 6500 },
        { id: '2', partName: 'Oil Filter HD', quantity: 1, unitPrice: 2000, total: 2000 },
      ]);
    }
  }, [initialData, isOpen, tankers]);

  // Recalculate material and total cost when parts or costs change
  useEffect(() => {
    const calculatedMaterialCost = parts.reduce((sum, p) => sum + (p.total || 0), 0);
    const calculatedTotal = calculatedMaterialCost + (formData.labourCost || 0) + (formData.otherCost || 0);

    setFormData((prev) => ({
      ...prev,
      materialCost: calculatedMaterialCost,
      totalCost: calculatedTotal,
    }));
  }, [parts, formData.labourCost, formData.otherCost]);

  const addSparePartRow = () => {
    setParts([
      ...parts,
      { id: Date.now().toString(), partName: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const updateSparePart = (index: number, key: keyof SparePartItem, val: any) => {
    const updated = [...parts];
    const item = { ...updated[index], [key]: val };
    if (key === 'quantity' || key === 'unitPrice') {
      item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    }
    updated[index] = item;
    setParts(updated);
  };

  const removeSparePart = (index: number) => {
    setParts(parts.filter((_, i) => i !== index));
  };

  const handleTankerChange = (tankerNo: string) => {
    const found = tankers.find((t) => t.tankerNumber === tankerNo);
    setFormData({
      ...formData,
      tankerNumber: tankerNo,
      tankerId: found?.id || '',
      currentKm: found?.currentKm || formData.currentKm,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      spareParts: parts,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Maintenance ${initialData.id}` : 'Create Maintenance Work Order'}
      subtitle="Log workshop servicing, spare parts used, labor charges, and completion status"
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Select Tanker *
            </label>
            <select
              value={formData.tankerNumber || ''}
              onChange={(e) => handleTankerChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              {tankers.map((t) => (
                <option key={t.id} value={t.tankerNumber}>
                  {t.tankerNumber} ({t.vehicleType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Maintenance Date *
            </label>
            <input
              type="date"
              required
              value={formData.date || ''}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Maintenance Type *
            </label>
            <select
              value={formData.type || 'Preventive'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Preventive">Preventive</option>
              <option value="Corrective">Corrective</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Current Odometer (KM)
            </label>
            <input
              type="number"
              value={formData.currentKm || 0}
              onChange={(e) => setFormData({ ...formData, currentKm: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Vendor / Service Center
            </label>
            <input
              type="text"
              value={formData.vendor || ''}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              placeholder="Authorized Workshop Name"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Work Order Status *
            </label>
            <select
              value={formData.status || 'Pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as MaintenanceStatus })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running (In Workshop)</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Reported Complaint / Issue
          </label>
          <input
            type="text"
            required
            value={formData.complaint || ''}
            onChange={(e) => setFormData({ ...formData, complaint: e.target.value })}
            placeholder="e.g. Brakes squeaking, radiator fluid leakage"
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Work Description Executed
          </label>
          <textarea
            rows={2}
            value={formData.workDescription || ''}
            onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
            placeholder="Detailed mechanical work completed by workshop technicians..."
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
          />
        </div>

        {/* Dynamic Spare Parts Table */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-[#1E3A8A] dark:text-blue-400" /> Spare Parts Itemization
            </h4>
            <button
              type="button"
              onClick={addSparePartRow}
              className="px-2.5 py-1 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Part
            </button>
          </div>

          <div className="space-y-2">
            {parts.map((pt, idx) => (
              <div key={pt.id || idx} className="grid grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  placeholder="Spare Part Name / Code"
                  value={pt.partName}
                  onChange={(e) => updateSparePart(idx, 'partName', e.target.value)}
                  className="col-span-5 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={pt.quantity}
                  onChange={(e) => updateSparePart(idx, 'quantity', Number(e.target.value))}
                  className="col-span-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-center"
                />
                <input
                  type="number"
                  placeholder="Unit Price (₹)"
                  value={pt.unitPrice}
                  onChange={(e) => updateSparePart(idx, 'unitPrice', Number(e.target.value))}
                  className="col-span-2 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-right"
                />
                <div className="col-span-2 text-xs font-bold text-slate-900 dark:text-white text-right font-mono">
                  ₹{(pt.total || 0).toLocaleString('en-IN')}
                </div>
                <button
                  type="button"
                  onClick={() => removeSparePart(idx)}
                  className="col-span-1 p-1 text-rose-600 hover:bg-rose-50 rounded flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Material Cost</label>
            <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              ₹{(formData.materialCost || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Labour Charges (₹)</label>
            <input
              type="number"
              value={formData.labourCost || 0}
              onChange={(e) => setFormData({ ...formData, labourCost: Number(e.target.value) })}
              className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Other Charges (₹)</label>
            <input
              type="number"
              value={formData.otherCost || 0}
              onChange={(e) => setFormData({ ...formData, otherCost: Number(e.target.value) })}
              className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded font-mono"
            />
          </div>

          <div className="bg-[#1E3A8A] text-white p-3 rounded-lg flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-blue-200">Total Work Order Cost</span>
            <span className="text-lg font-black font-mono">₹{(formData.totalCost || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg shadow-sm"
          >
            Save Work Order Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};
