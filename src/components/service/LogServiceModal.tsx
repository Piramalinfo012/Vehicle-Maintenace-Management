import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Tanker, MaintenanceRecord } from '../../types';
import { Wrench, Calendar, Gauge, DollarSign, Building2, CheckCircle } from 'lucide-react';
import {
  formatToDDMMYYYY,
  formatForDateInput,
  formatFromDateInput,
  getTodayDDMMYYYY,
  addMonthsToDDMMYYYY,
} from '../../utils/dateUtils';

interface LogServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tankers: Tanker[];
  defaultTankerNumber?: string;
  onSaveService: (record: Partial<MaintenanceRecord>, updatedVehicle: {
    tankerNumber: string;
    lastServiceDate: string;
    lastServiceKm: number;
    nextServiceDueDate: string;
    nextServiceDueKm: number;
    currentKm: number;
  }) => void;
}

export const LogServiceModal: React.FC<LogServiceModalProps> = ({
  isOpen,
  onClose,
  tankers = [],
  defaultTankerNumber,
  onSaveService,
}) => {
  const selectedVehicle = tankers.find((t) => t.tankerNumber === defaultTankerNumber) || tankers[0];

  const [tankerNumber, setTankerNumber] = useState<string>(selectedVehicle?.tankerNumber || '');
  const [serviceDate, setServiceDate] = useState<string>(getTodayDDMMYYYY());
  const [currentKm, setCurrentKm] = useState<number>(selectedVehicle?.currentKm || 25000);
  const [serviceType, setServiceType] = useState<string>('Preventive');
  const [vendor, setVendor] = useState<string>('Official Authorized Workshop');
  const [complaint, setComplaint] = useState<string>('Routine Periodic Servicing, Oil Change & Filter Replacement');
  const [workDescription, setWorkDescription] = useState<string>('Replaced engine oil, oil filter, air filter, checked brake pads & tire pressure.');
  const [totalCost, setTotalCost] = useState<number>(12500);

  // Next Service due state
  const [intervalOption, setIntervalOption] = useState<string>('6_months_10k');
  const [nextDueDate, setNextDueDate] = useState<string>('');
  const [nextDueKm, setNextDueKm] = useState<number>(35000);

  // Update currentKm and vehicle details when selected tanker changes
  useEffect(() => {
    const veh = tankers.find((t) => t.tankerNumber === tankerNumber);
    if (veh) {
      setCurrentKm(veh.currentKm || 0);
      calculateNextSchedule(serviceDate, veh.currentKm || 0, intervalOption);
    }
  }, [tankerNumber, tankers]);

  useEffect(() => {
    calculateNextSchedule(serviceDate, currentKm, intervalOption);
  }, [serviceDate, currentKm, intervalOption]);

  const calculateNextSchedule = (sDate: string, km: number, option: string) => {
    let monthsToAdd = 6;
    let kmToAdd = 10000;

    if (option === '3_months_5k') {
      monthsToAdd = 3;
      kmToAdd = 5000;
    } else if (option === '6_months_10k') {
      monthsToAdd = 6;
      kmToAdd = 10000;
    } else if (option === '12_months_15k') {
      monthsToAdd = 12;
      kmToAdd = 15000;
    }

    if (option !== 'custom') {
      setNextDueDate(addMonthsToDDMMYYYY(sDate, monthsToAdd));
      setNextDueKm(Number(km) + kmToAdd);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const veh = tankers.find((t) => t.tankerNumber === tankerNumber) || selectedVehicle;
    if (!veh) return;

    const formattedServiceDate = formatToDDMMYYYY(serviceDate);
    const formattedNextDueDate = formatToDDMMYYYY(nextDueDate);

    const maintenanceRecord: Partial<MaintenanceRecord> = {
      date: formattedServiceDate,
      tankerId: veh.id,
      tankerNumber: veh.tankerNumber,
      currentKm: Number(currentKm),
      type: serviceType as any,
      vendor,
      workshop: vendor,
      complaint,
      workDescription,
      totalCost: Number(totalCost),
      labourCost: Math.round(Number(totalCost) * 0.3),
      materialCost: Math.round(Number(totalCost) * 0.7),
      otherCost: 0,
      expectedCompletion: formattedServiceDate,
      actualCompletion: formattedServiceDate,
      status: 'Completed',
      remarks: `Next Service due on ${formattedNextDueDate} or at ${nextDueKm?.toLocaleString()} KM.`,
      nextServiceDueDate: formattedNextDueDate,
      nextServiceDueKm: Number(nextDueKm),
    };

    onSaveService(maintenanceRecord, {
      tankerNumber: veh.tankerNumber,
      lastServiceDate: formattedServiceDate,
      lastServiceKm: Number(currentKm),
      nextServiceDueDate: formattedNextDueDate,
      nextServiceDueKm: Number(nextDueKm),
      currentKm: Math.max(veh.currentKm, Number(currentKm)),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🛠️ Record Vehicle Service & Next Schedule"
      subtitle="Log completed service details, cost, and automatically configure next due date/KM"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Select Fleet Vehicle *
            </label>
            <select
              value={tankerNumber}
              onChange={(e) => setTankerNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            >
              {tankers.map((t) => (
                <option key={t.id} value={t.tankerNumber}>
                  {t.tankerNumber} - {t.manufacturer} {t.model} ({t.vehicleType})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Service Completion Date *
            </label>
            <input
              type="date"
              value={formatForDateInput(serviceDate)}
              onChange={(e) => setServiceDate(formatFromDateInput(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Odometer and Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-500" />
              Service Odometer (KM) *
            </label>
            <input
              type="number"
              value={currentKm}
              onChange={(e) => setCurrentKm(Number(e.target.value))}
              placeholder="e.g. 28400"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              Service Category *
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
            >
              <option value="Preventive">Preventive Periodic Servicing</option>
              <option value="Corrective">Oil & Filter Replacement</option>
              <option value="Emergency">Brake & Suspension Overhaul</option>
              <option value="Emergency">Engine Tune-Up / Repairs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Total Service Cost (₹) *
            </label>
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(Number(e.target.value))}
              placeholder="e.g. 15000"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-emerald-600"
              required
            />
          </div>
        </div>

        {/* Vendor & Work Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-500" />
              Workshop / Authorized Dealer Name *
            </label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Auto Hangar Mercedes-Benz / Lakozy Toyota"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Service Headline / Complaint Summary
            </label>
            <input
              type="text"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="e.g. 30,000 KM Scheduled Servicing"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Detailed Work Done & Parts Replaced
          </label>
          <textarea
            rows={2}
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            placeholder="Engine synthetic oil change, OEM air filter, cabin AC filter, wheel alignment..."
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        {/* NEXT SERVICE SCHEDULE CONFIGURATOR */}
        <div className="p-4 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Configure Next Service Due Schedule
            </h4>
            <span className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">Automatic Reminder Rule</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setIntervalOption('6_months_10k')}
              className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                intervalOption === '6_months_10k'
                  ? 'bg-[#1E3A8A] text-white border-blue-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">6 Months / +10,000 KM</div>
              <div className="text-[10px] opacity-80">Standard Fleet Interval</div>
            </button>

            <button
              type="button"
              onClick={() => setIntervalOption('12_months_15k')}
              className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                intervalOption === '12_months_15k'
                  ? 'bg-[#1E3A8A] text-white border-blue-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">12 Months / +15,000 KM</div>
              <div className="text-[10px] opacity-80">Director / Executive Cars</div>
            </button>

            <button
              type="button"
              onClick={() => setIntervalOption('3_months_5k')}
              className={`p-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                intervalOption === '3_months_5k'
                  ? 'bg-[#1E3A8A] text-white border-blue-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">3 Months / +5,000 KM</div>
              <div className="text-[10px] opacity-80">Heavy Duty Commercial</div>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-200 mb-1">
                Next Service Due Date
              </label>
              <input
                type="date"
                value={formatForDateInput(nextDueDate)}
                onChange={(e) => {
                  setIntervalOption('custom');
                  setNextDueDate(formatFromDateInput(e.target.value));
                }}
                className="w-full px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-blue-900 dark:text-blue-200 mb-1">
                Next Service Due Odometer (KM)
              </label>
              <input
                type="number"
                value={nextDueKm}
                onChange={(e) => {
                  setIntervalOption('custom');
                  setNextDueKm(Number(e.target.value));
                }}
                className="w-full px-3 py-1.5 text-xs font-bold font-mono bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-lg text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            Save & Update Service Log
          </button>
        </div>
      </form>
    </Modal>
  );
};
