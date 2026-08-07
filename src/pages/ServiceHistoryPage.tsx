import React, { useState } from 'react';
import { MaintenanceRecord, Tanker } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { LogServiceModal } from '../components/service/LogServiceModal';
import {
  History,
  Wrench,
  Calendar,
  Gauge,
  Plus,
  Car,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  DollarSign,
  Search,
  Filter,
} from 'lucide-react';

interface ServiceHistoryPageProps {
  maintenance: MaintenanceRecord[];
  tankers: Tanker[];
  onAddMaintenance?: (record: Partial<MaintenanceRecord>) => void;
  onUpdateVehicleService?: (updatedVehicle: {
    tankerNumber: string;
    lastServiceDate: string;
    lastServiceKm: number;
    nextServiceDueDate: string;
    nextServiceDueKm: number;
    currentKm: number;
  }) => void;
  filterTankerNumber?: string;
}

export const ServiceHistoryPage: React.FC<ServiceHistoryPageProps> = ({
  maintenance = [],
  tankers = [],
  onAddMaintenance,
  onUpdateVehicleService,
  filterTankerNumber,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'logs'>('schedule');
  const [selectedTanker, setSelectedTanker] = useState<string>(filterTankerNumber || 'All');
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [modalDefaultTanker, setModalDefaultTanker] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Calculate Service Status for each vehicle
  const getVehicleServiceStatus = (v: Tanker) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const today = new Date();

    if (!v.nextServiceDueDate && !v.nextServiceDueKm) {
      return { status: 'Unknown', label: 'Not Scheduled', color: 'bg-slate-100 text-slate-700' };
    }

    let isOverdue = false;
    let isDueSoon = false;

    if (v.nextServiceDueDate) {
      const dueDate = new Date(v.nextServiceDueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        isOverdue = true;
      } else if (diffDays <= 30) {
        isDueSoon = true;
      }
    }

    if (v.nextServiceDueKm && v.currentKm) {
      const diffKm = v.nextServiceDueKm - v.currentKm;
      if (diffKm <= 0) {
        isOverdue = true;
      } else if (diffKm <= 1000) {
        isDueSoon = true;
      }
    }

    if (isOverdue) {
      return { status: 'Overdue', label: '🔴 Service Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300' };
    }
    if (isDueSoon) {
      return { status: 'Due Soon', label: '🟡 Service Due Soon', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300' };
    }
    return { status: 'Up to Date', label: '🟢 Service Up to Date', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300' };
  };

  // Metrics calculation
  const totalVehicles = tankers.length;
  let overdueCount = 0;
  let dueSoonCount = 0;
  let upToDateCount = 0;

  tankers.forEach((t) => {
    const status = getVehicleServiceStatus(t).status;
    if (status === 'Overdue') overdueCount++;
    else if (status === 'Due Soon') dueSoonCount++;
    else upToDateCount++;
  });

  const totalSpent = maintenance.reduce((sum, m) => sum + (m.totalCost || 0), 0);

  // Handle Save Service
  const handleSaveService = (
    record: Partial<MaintenanceRecord>,
    updatedVeh: {
      tankerNumber: string;
      lastServiceDate: string;
      lastServiceKm: number;
      nextServiceDueDate: string;
      nextServiceDueKm: number;
      currentKm: number;
    }
  ) => {
    if (onAddMaintenance) {
      onAddMaintenance(record);
    }
    if (onUpdateVehicleService) {
      onUpdateVehicleService(updatedVeh);
    }
  };

  // Filtered vehicles for Schedule view
  const filteredVehicles = tankers.filter((t) => {
    if (selectedTanker !== 'All' && t.tankerNumber !== selectedTanker) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.tankerNumber.toLowerCase().includes(q) ||
        t.model.toLowerCase().includes(q) ||
        t.manufacturer.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        t.owner.toLowerCase().includes(q) ||
        t.vehicleType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered maintenance history
  const filteredHistory = maintenance.filter((m) => {
    if (selectedTanker !== 'All' && m.tankerNumber !== selectedTanker) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) ||
        m.tankerNumber.toLowerCase().includes(q) ||
        m.vendor.toLowerCase().includes(q) ||
        m.complaint.toLowerCase().includes(q) ||
        m.workDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Table Columns for History view
  const historyColumns: Column<MaintenanceRecord>[] = [
    {
      header: 'Ticket ID',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</span>,
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Service Date',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">{row.date}</span>,
      sortable: true,
      sortKey: 'date',
    },
    {
      header: 'Vehicle / Reg No',
      accessor: (row) => (
        <div>
          <span className="font-bold font-mono text-slate-900 dark:text-white">{row.tankerNumber}</span>
        </div>
      ),
    },
    {
      header: 'Odometer (KM)',
      accessor: (row) => <span className="font-mono">{row.currentKm?.toLocaleString('en-IN')} KM</span>,
    },
    {
      header: 'Category',
      accessor: (row) => <Badge status={row.type} size="sm" />,
    },
    {
      header: 'Workshop & Work Details',
      accessor: (row) => (
        <div className="max-w-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200">{row.vendor}</div>
          <div className="text-[11px] text-slate-500 line-clamp-1">{row.complaint || row.workDescription}</div>
        </div>
      ),
    },
    {
      header: 'Total Cost',
      accessor: (row) => (
        <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">
          ₹{row.totalCost?.toLocaleString('en-IN')}
        </span>
      ),
      sortable: true,
      sortKey: 'totalCost',
    },
    {
      header: 'Next Service Due',
      accessor: (row) => (
        <div className="text-xs font-mono text-blue-700 dark:text-blue-400 font-semibold">
          {row.nextServiceDueDate || 'N/A'} {row.nextServiceDueKm ? `(${row.nextServiceDueKm.toLocaleString()} KM)` : ''}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Vehicle Service Tracking & Schedule Logs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time maintenance tracking for Director Cars, Executive Fleet, and Commercial Tankers — check last service date & next service due schedule
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setModalDefaultTanker(selectedTanker !== 'All' ? selectedTanker : tankers[0]?.tankerNumber || '');
              setIsLogModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + Record Completed Service
          </button>
        </div>
      </div>

      {/* KPI Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Fleet</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">{totalVehicles} Vehicles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Up To Date</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{upToDateCount} Vehicles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Due Soon</div>
            <div className="text-lg font-black text-amber-600 dark:text-amber-400">{dueSoonCount} Vehicles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overdue Service</div>
            <div className="text-lg font-black text-red-600 dark:text-red-400">{overdueCount} Vehicles</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Spent</div>
            <div className="text-base font-black text-slate-900 dark:text-white">
              ₹{totalSpent.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4 text-blue-600" />
            <span>🚗 Vehicle Service Status & Next Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-purple-600" />
            <span>📋 Historical Service Logs ({maintenance.length})</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Reg #, Model, Driver..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedTanker}
              onChange={(e) => setSelectedTanker(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200 w-full sm:w-auto"
            >
              <option value="All">All Fleet Vehicles</option>
              {tankers.map((t) => (
                <option key={t.id} value={t.tankerNumber}>
                  {t.tankerNumber} - {t.model}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: VEHICLE SERVICE SCHEDULE & NEXT DUE TRACKER */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const statusInfo = getVehicleServiceStatus(vehicle);
            const vehicleLogs = maintenance.filter((m) => m.tankerNumber === vehicle.tankerNumber);
            const lastLog = vehicleLogs[0]; // most recent log

            return (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Vehicle Header Card */}
                <div>
                  <div className="relative h-36 bg-slate-900 overflow-hidden">
                    <img
                      src={vehicle.photoUrl || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'}
                      alt={vehicle.model}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-full shadow-md ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold font-mono tracking-tight">{vehicle.tankerNumber}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm font-semibold">
                          {vehicle.vehicleType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">{vehicle.manufacturer} {vehicle.model}</p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Owner / Dept</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{vehicle.owner}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Odometer</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {vehicle.currentKm?.toLocaleString()} KM
                        </span>
                      </div>
                    </div>

                    {/* Service Dates Comparison */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                          <History className="w-3.5 h-3.5 text-blue-500" />
                          <span>Last Serviced:</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 dark:text-white font-mono">
                            {vehicle.lastServiceDate || lastLog?.date || 'Not recorded'}
                          </span>
                          {vehicle.lastServiceKm && (
                            <span className="block text-[10px] text-slate-500 font-mono">
                              @ {vehicle.lastServiceKm.toLocaleString()} KM
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-1.5 text-blue-900 dark:text-blue-300 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>Next Service Due:</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-blue-700 dark:text-blue-300 font-mono text-sm">
                            {vehicle.nextServiceDueDate || '15 Dec 2026'}
                          </span>
                          {vehicle.nextServiceDueKm && (
                            <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                              @ {vehicle.nextServiceDueKm.toLocaleString()} KM
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Last Service Notes */}
                    {lastLog && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 p-2 rounded-lg line-clamp-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Last Work: </span>
                        {lastLog.complaint || lastLog.workDescription} ({lastLog.vendor})
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedTanker(vehicle.tankerNumber);
                      setActiveTab('logs');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all flex items-center gap-1"
                  >
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Logs ({vehicleLogs.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setModalDefaultTanker(vehicle.tankerNumber);
                      setIsLogModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-800 rounded-lg transition-all shadow-sm flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>+ Log Service</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: HISTORICAL SERVICE LOGS TABLE */}
      {activeTab === 'logs' && (
        <Table
          title={`Historical Maintenance & Servicing Logs (${filteredHistory.length})`}
          columns={historyColumns}
          data={filteredHistory}
          searchPlaceholder="Search Ticket ID, Vehicle Reg #, Workshop, Service details..."
        />
      )}

      {/* MODAL: LOG NEW SERVICE */}
      {isLogModalOpen && (
        <LogServiceModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          tankers={tankers}
          defaultTankerNumber={modalDefaultTanker}
          onSaveService={handleSaveService}
        />
      )}
    </div>
  );
};
