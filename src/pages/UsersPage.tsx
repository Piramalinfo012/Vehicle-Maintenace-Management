import React, { useState } from 'react';
import { User } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { Users, UserPlus, Shield, Mail, Key } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      username: 'admin',
      fullName: 'Vikramaditya Piramal',
      email: 'admin@piramalpetroleum.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: '2026-08-07 08:30 AM',
    },
    {
      id: 'USR-002',
      username: 'manager_fleet',
      fullName: 'Sanjay Sharma',
      email: 'sanjay.sharma@piramalpetroleum.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2026-08-06 05:45 PM',
    },
    {
      id: 'USR-003',
      username: 'exec_workshop',
      fullName: 'Amit Patel',
      email: 'amit.patel@piramalpetroleum.com',
      role: 'Maintenance Executive',
      status: 'Active',
      lastLogin: '2026-08-07 09:12 AM',
    },
    {
      id: 'USR-004',
      username: 'coordinator_trans',
      fullName: 'Rajesh Verma',
      email: 'rajesh.v@piramalpetroleum.com',
      role: 'Transport Coordinator',
      status: 'Active',
      lastLogin: '2026-08-05 02:10 PM',
    },
    {
      id: 'USR-005',
      username: 'auditor_viewer',
      fullName: 'Kavita Singh',
      email: 'kavita.s@piramalpetroleum.com',
      role: 'Viewer',
      status: 'Active',
      lastLogin: '2026-08-01 11:00 AM',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    username: '',
    email: '',
    role: 'Maintenance Executive',
    status: 'Active',
  });

  const columns: Column<User>[] = [
    {
      header: 'User ID',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</span>,
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Full Name & Email',
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{row.fullName}</div>
          <div className="text-[11px] text-slate-500 font-mono">{row.email}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'fullName',
    },
    {
      header: 'Username',
      accessor: (row) => <span className="font-mono text-slate-700 dark:text-slate-300">@{row.username}</span>,
    },
    {
      header: 'Role Access Level',
      accessor: (row) => <Badge status={row.role} size="sm" />,
      sortable: true,
      sortKey: 'role',
    },
    {
      header: 'Account Status',
      accessor: (row) => <Badge status={row.status} size="sm" />,
    },
    {
      header: 'Last Authentication',
      accessor: (row) => <span className="font-mono text-slate-500 text-[11px]">{row.lastLogin || 'Never'}</span>,
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `USR-${(users.length + 1).toString().padStart(3, '0')}`,
      name: formData.fullName || 'New User',
      fullName: formData.fullName || 'New User',
      username: formData.username || `user_${Date.now().toString().slice(-4)}`,
      email: formData.email || 'user@piramalpetroleum.com',
      phone: '+91 98000 00000',
      department: 'Fleet Operations',
      role: formData.role || 'Maintenance Executive',
      status: 'Active',
      lastLogin: 'Never',
    };

    setUsers([...users, newUser]);
    showToast('User Created', `User account for ${newUser.fullName} registered successfully`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            User Master & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage system access, encrypted authentication credentials, and functional security permissions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-xl shadow-md shadow-blue-950/30 transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> Provision New User Account
        </button>
      </div>

      <Table title="User Directory Master" columns={columns} data={users} searchPlaceholder="Search Name, Email, Role..." />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New User Master Account"
        subtitle="Credentials will sync directly with Google Sheets User Master database"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Ramesh Chandra"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Username *
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="e.g. ramesh_c"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Corporate Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@piramalpetroleum.com"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Assigned System Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-bold"
              >
                <option value="Admin">Admin (Full Control)</option>
                <option value="Manager">Manager (Approvals & Management)</option>
                <option value="Maintenance Executive">Maintenance Executive (Workshop Operations)</option>
                <option value="Transport Coordinator">Transport Coordinator (Fleet Logs & Drivers)</option>
                <option value="Viewer">Viewer (Read-Only Audit)</option>
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
            <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-[#1E3A8A] rounded-lg shadow-sm">
              Create User Master Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
