import React, { useState } from 'react';
import { BreakdownRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { AlertTriangle, Plus, PhoneCall, MapPin, Wrench } from 'lucide-react';
import { formatToDDMMYYYY, getTodayDDMMYYYY } from '../utils/dateUtils';

interface BreakdownPageProps {
  breakdowns?: BreakdownRecord[];
  tankers?: Tanker[];
  onReportBreakdown?: (record: Partial<BreakdownRecord>) => void;
}

export const BreakdownPage: React.FC<BreakdownPageProps> = ({
  breakdowns: initialBreakdowns = [],
  tankers = [],
  onReportBreakdown,
}) => {
  const { showToast } = useNotification();
  const [breakdownList, setBreakdownList] = useState<BreakdownRecord[]>(initialBreakdowns || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BreakdownRecord>>({
    tankerNumber: tankers[0]?.tankerNumber || 'MH-04-FK-1201',
    driverName: 'Ramesh Pawar',
    driverPhone: '+91 98201 44510',
    breakdownDate: getTodayDDMMYYYY() + ' 14:30',
    location: 'NH-48 Highway, near Manor Toll Plaza',
    issueCategory: 'Engine Overheating & Coolant Leak',
    description: 'Engine temperature indicator turned red, high pressure steam from radiator cap.',
    actionTaken: 'Mobile roadside assistance dispatched from Mumbai hub.',
    towingRequired: false,
    assignedMechanic: 'Prakash Roadside Emergency Services',
    status: 'Reported',
  });

  const columns: Column<BreakdownRecord>[] = [
    {
      header: 'Incident ID / Date',
      accessor: (row) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.breakdownDate}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Tanker Number',
      accessor: (row) => <span className="font-bold font-mono text-rose-600 dark:text-rose-400">{row.tankerNumber}</span>,
    },
    {
      header: 'Driver & Contact',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{row.driverName}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.driverPhone}</div>
        </div>
      ),
    },
    {
      header: 'Location & Problem',
      accessor: (row) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 truncate">
            <MapPin className="w-3 h-3 text-rose-500 shrink-0" /> {row.location}
          </div>
          <div className="text-[11px] text-slate-500 truncate">{row.issueCategory}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Response',
      accessor: (row) => <span className="font-medium text-slate-700 dark:text-slate-300">{row.assignedMechanic || 'TBD'}</span>,
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
    const formattedDate = formatToDDMMYYYY(formData.breakdownDate || getTodayDDMMYYYY());
    const incident: BreakdownRecord = {
      id: `BDK-${Date.now().toString().slice(-4)}`,
      date: formattedDate,
      breakdownDate: formData.breakdownDate || formattedDate,
      tankerNumber: formData.tankerNumber || 'MH-04-FK-1201',
      driverName: formData.driverName || 'Driver',
      driverPhone: formData.driverPhone || '+91 98000 00000',
      location: formData.location || 'Highway',
      issueCategory: formData.issueCategory || 'General Mechanical Breakdown',
      complaint: formData.issueCategory || 'Highway Mechanical Breakdown',
      description: formData.description || '',
      actionTaken: formData.actionTaken || 'Emergency team dispatched',
      towingRequired: Boolean(formData.towingRequired),
      assignedMechanic: formData.assignedMechanic || 'Emergency Patrol Unit',
      estimatedCost: 15000,
      status: 'Reported',
    };

    setBreakdownList([incident, ...breakdownList]);
    onReportBreakdown(incident);
    showToast('Breakdown Alert Raised', `Emergency ticket ${incident.id} created for ${incident.tankerNumber}`, 'danger');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Highway Breakdown & Roadside Assistance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time roadside emergency incident response, towing dispatch, and driver safety coordinates
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5"
        >
          <AlertTriangle className="w-4 h-4" /> Report New Breakdown
        </button>
      </div>

      <Table
        title="Active Highway Breakdown Incidents"
        columns={columns}
        data={breakdownList}
        searchPlaceholder="Search Incident ID, Tanker, Driver, Highway..."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report Highway Breakdown Incident"
        subtitle="Log roadside failure details to dispatch towing or emergency mechanics"
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Affected Tanker *
              </label>
              <select
                value={formData.tankerNumber}
                onChange={(e) => setFormData({ ...formData, tankerNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              >
                {tankers.map((t) => (
                  <option key={t.id} value={t.tankerNumber}>
                    {t.tankerNumber} ({t.driver})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Driver Phone Contact
              </label>
              <input
                type="text"
                required
                value={formData.driverPhone}
                onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                placeholder="+91 98000 00000"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Breakdown Location / Highway Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. NH-48 KM 120 near Manor Toll Plaza"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Issue Category *
              </label>
              <input
                type="text"
                required
                value={formData.issueCategory}
                onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
                placeholder="e.g. Clutch failure / Brake lock / Radiator rupture"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Driver Incident Description
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail symptoms, smoke, leakage or vehicle posture..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
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
            <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-rose-600 rounded-lg shadow-sm">
              Dispatch Emergency Response
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
