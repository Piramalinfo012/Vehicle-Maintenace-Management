import React, { useState } from 'react';
import { FuelLog, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Fuel, Plus, DollarSign, Gauge } from 'lucide-react';

export const FuelPage: React.FC<{ tankers: Tanker[] }> = ({ tankers }) => {
  const { showToast } = useNotification();

  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([
    {
      id: 'FUEL-901',
      date: '2026-08-06',
      tankerNumber: 'MH-04-FK-1201',
      driverName: 'Mahesh Jadhav',
      litres: 350,
      ratePerLitre: 92.8,
      totalAmount: 32480,
      odometerKm: 142500,
      fuelStation: 'HPCL Auto Terminal Thane',
      fullTank: true,
    },
    {
      id: 'FUEL-902',
      date: '2026-08-05',
      tankerNumber: 'MH-12-PQ-4590',
      driverName: 'Santosh Deshmukh',
      litres: 280,
      ratePerLitre: 92.8,
      totalAmount: 25984,
      odometerKm: 189200,
      fuelStation: 'IOCL Highway Depot Pune',
      fullTank: true,
    },
    {
      id: 'FUEL-903',
      date: '2026-08-03',
      tankerNumber: 'GJ-06-TR-8812',
      driverName: 'Vikram Singh',
      litres: 400,
      ratePerLitre: 91.5,
      totalAmount: 36600,
      odometerKm: 98400,
      fuelStation: 'BPCL Tanker Fuel Hub Vadodara',
      fullTank: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState<Partial<FuelLog>>({
    date: new Date().toISOString().slice(0, 10),
    tankerNumber: tankers[0]?.tankerNumber || 'MH-04-FK-1201',
    driverName: 'Mahesh Jadhav',
    litres: 300,
    ratePerLitre: 92.8,
    totalAmount: 27840,
    odometerKm: 142600,
    fuelStation: 'HPCL Terminal Thane',
    fullTank: true,
  });

  const columns: Column<FuelLog>[] = [
    {
      header: 'Log ID / Date',
      accessor: (row) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.date}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>,
    },
    {
      header: 'Driver Name',
      accessor: (row) => <span className="font-medium text-slate-800 dark:text-slate-200">{row.driverName}</span>,
    },
    {
      header: 'Litres Filled',
      accessor: (row) => <span className="font-bold font-mono">{row.litres} L</span>,
    },
    {
      header: 'Rate / Litre',
      accessor: (row) => <span className="font-mono">₹{row.ratePerLitre}</span>,
    },
    {
      header: 'Total Fuel Cost',
      accessor: (row) => <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">₹{row.totalAmount.toLocaleString('en-IN')}</span>,
      sortable: true,
      sortKey: 'totalAmount',
    },
    {
      header: 'Fuel Station',
      accessor: (row) => <span className="text-slate-700 dark:text-slate-300">{row.fuelStation}</span>,
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: FuelLog = {
      id: `FUEL-${Date.now().toString().slice(-4)}`,
      date: newLog.date || new Date().toISOString().slice(0, 10),
      tankerNumber: newLog.tankerNumber || 'MH-04-FK-1201',
      driverName: newLog.driverName || 'Driver',
      litres: Number(newLog.litres || 0),
      ratePerLitre: Number(newLog.ratePerLitre || 0),
      totalAmount: Number(newLog.litres || 0) * Number(newLog.ratePerLitre || 0),
      odometerKm: Number(newLog.odometerKm || 0),
      fuelStation: newLog.fuelStation || 'Station',
      fullTank: Boolean(newLog.fullTank),
    };

    setFuelLogs([entry, ...fuelLogs]);
    showToast('Fuel Log Saved', `Recorded ${entry.litres}L fuel entry for ${entry.tankerNumber}`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Fleet Fuel Dispensing Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track diesel consumption, fuel station invoices, odometer readings, and efficiency metrics
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Fuel Entry
        </button>
      </div>

      <Table
        title="Recent Fuel Records"
        columns={columns}
        data={fuelLogs}
        searchPlaceholder="Search by Tanker Number, Station, Driver..."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record New Fuel Refuel"
        subtitle="Log Diesel filling entry from authorized fuel stations"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Select Tanker
              </label>
              <select
                value={newLog.tankerNumber}
                onChange={(e) => setNewLog({ ...newLog, tankerNumber: e.target.value })}
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
                Refuel Date
              </label>
              <input
                type="date"
                required
                value={newLog.date}
                onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Litres Filled
              </label>
              <input
                type="number"
                required
                value={newLog.litres}
                onChange={(e) => setNewLog({ ...newLog, litres: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Rate / Litre (₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={newLog.ratePerLitre}
                onChange={(e) => setNewLog({ ...newLog, ratePerLitre: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Fuel Station Name
              </label>
              <input
                type="text"
                required
                value={newLog.fuelStation}
                onChange={(e) => setNewLog({ ...newLog, fuelStation: e.target.value })}
                placeholder="e.g. HPCL Terminal Thane"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl flex items-center justify-between text-xs font-bold text-[#1E3A8A] dark:text-blue-300">
            <span>Calculated Total:</span>
            <span className="text-base font-mono">
              ₹{(Number(newLog.litres || 0) * Number(newLog.ratePerLitre || 0)).toLocaleString('en-IN')}
            </span>
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
              Save Entry
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
