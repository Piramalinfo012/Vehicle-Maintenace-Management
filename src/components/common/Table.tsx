import React, { useState } from 'react';
import { Pagination } from './Pagination';
import { exportToExcel, exportToPdf, printTable } from '../../services/exportUtils';
import { Search, Download, Printer, FileSpreadsheet, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
  sortKey?: string;
  className?: string;
}

interface TableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addLabel?: string;
  canAdd?: boolean;
  tableId?: string;
  pageSize?: number;
}

export function Table<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data = [],
  searchPlaceholder = 'Search records...',
  onAddClick,
  addLabel = 'Add New',
  canAdd = true,
  tableId = 'enterprise-data-table',
  pageSize = 8,
}: TableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Search Filter
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (valA === valB) return 0;
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }

    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleExportExcel = () => {
    exportToExcel(sortedData, title || 'Export');
  };

  const handleExportPdf = () => {
    const headers = columns.map((c) => c.header);
    const rows = sortedData.map((row) =>
      columns.map((c) => {
        if (typeof c.accessor === 'function') {
          return ''; // fallback text for complex react nodes
        }
        return row[c.accessor as keyof T] ?? '';
      })
    );
    exportToPdf(title || 'Data Report', headers, rows, title || 'Report');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Controls */}
      <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <div>
          {title && <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 text-slate-900 dark:text-white transition-all shadow-xs"
            />
          </div>

          {/* Export Actions */}
          <button
            onClick={handleExportExcel}
            title="Download Excel"
            className="p-2 text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl hover:bg-emerald-100 transition-all inline-flex items-center gap-1 shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Excel</span>
          </button>

          <button
            onClick={handleExportPdf}
            title="Download PDF"
            className="p-2 text-xs font-semibold text-rose-700 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 rounded-xl hover:bg-rose-100 transition-all inline-flex items-center gap-1 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={() => printTable(title || 'Report', tableId)}
            title="Print Table"
            className="p-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Add New Button */}
          {onAddClick && canAdd && (
            <button
              onClick={onAddClick}
              className="px-4 py-1.5 text-xs font-bold text-white premium-gradient-btn rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
            >
              <span>+</span> {addLabel}
            </button>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table id={tableId} className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-extrabold text-[11px]">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-3.5 ${col.className || ''}`}>
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && col.sortKey && (
                      <button
                        onClick={() => handleSort(col.sortKey!)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-800 dark:text-slate-200 font-medium">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className="hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors"
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={`p-3.5 ${col.className || ''}`}>
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-slate-400">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={sortedData.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
