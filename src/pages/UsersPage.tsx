import React, { useState } from 'react';
import { User } from '../types';
import { Table, Column } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useNotification } from '../context/NotificationContext';
import { UserPlus } from 'lucide-react';

export const UsersPage: React.FC<{
  users?: User[];
  onAddUser?: (user: User, password: string) => void;
}> = ({ users = [], onAddUser }) => {
  const { showToast } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ id: string; name: string; role: User['role']; password: string }>({
    id: '',
    name: '',
    role: 'Maintenance Executive',
    password: '',
  });

  const columns: Column<User>[] = [
    {
      header: 'User ID (Login)',
      accessor: (row) => <span className="font-bold font-mono text-slate-900 dark:text-white">{row.id}</span>,
      sortable: true,
      sortKey: 'id',
    },
    {
      header: 'Name',
      accessor: (row) => <span className="font-bold text-slate-900 dark:text-white">{row.name}</span>,
      sortable: true,
      sortKey: 'name',
    },
    {
      header: 'Role Access Level',
      accessor: (row) => <Badge status={row.role} size="sm" />,
      sortable: true,
      sortKey: 'role',
    },
    {
      header: 'Last Authentication',
      accessor: (row) => <span className="font-mono text-slate-500 text-[11px]">{row.lastLogin || 'Never'}</span>,
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: formData.id.trim(),
      name: formData.name.trim() || formData.id.trim(),
      email: '',
      phone: '',
      department: '',
      role: formData.role,
      status: 'Active',
      lastLogin: '',
    };

    onAddUser?.(newUser, formData.password);
    showToast('User Created', `User account for ${newUser.name} registered successfully`, 'success');
    setIsModalOpen(false);
    setFormData({ id: '', name: '', role: 'Maintenance Executive', password: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            User Master & Role-Based Access Control (RBAC)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage system access, login credentials, and functional security permissions
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-[#1E3A8A] hover:bg-blue-900 rounded-xl shadow-md shadow-blue-950/30 transition-all flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> Provision New User Account
        </button>
      </div>

      <Table title="User Directory Master" columns={columns} data={users} searchPlaceholder="Search User ID, Name, Role..." />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New User Master Account"
        subtitle="Credentials sync directly with the Users tab in your Google Sheet"
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                User ID (Login) *
              </label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="e.g. ramesh"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Chandra"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Initial Password *
              </label>
              <input
                type="text"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Set an initial login password"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Assigned System Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
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
