import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Users, RefreshCw, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useUIStore } from '../store/uiStore';
import { QUERY_KEYS, PAGINATION_DEFAULTS } from '../config/constants';
import type { User, AdminUserFilters } from '../types';

const AdminUsersPage: React.FC = () => {
  const { addToast } = useUIStore();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<AdminUserFilters>({
    search: '', role: '', status: '',
    page: PAGINATION_DEFAULTS.PAGE, limit: PAGINATION_DEFAULTS.LIMIT,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.USERS, filters],
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      adminApi.updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ type: 'success', title: 'User updated' });
    },
    onError: () => addToast({ type: 'error', title: 'Update failed' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      addToast({ type: 'success', title: 'User deleted' });
    },
    onError: () => addToast({ type: 'error', title: 'Delete failed' }),
  });

  const toggleStatus = (user: User) => {
    updateMutation.mutate({
      id: user._id,
      updates: { status: user.status === 'active' ? 'suspended' : 'active' },
    });
  };

  const toggleRole = (user: User) => {
    updateMutation.mutate({
      id: user._id,
      updates: { role: user.role === 'admin' ? 'user' : 'admin' },
    });
  };

  const users = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 6 }} className="text-primary">
              <Users size={24} style={{ display: 'inline', marginRight: 8, color: 'var(--color-brand-400)' }} />
              User Management
            </h1>
            <p className="text-secondary" style={{ fontSize: 14 }}>
              Manage roles, status, and accounts across the platform.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isFetching && <RefreshCw size={14} style={{ color: 'var(--text-muted)', animation: 'spin 1s linear infinite' }} />}
            <span style={{ fontSize: 13, fontWeight: 600 }} className="text-secondary">{pagination?.total ?? 0} total users</span>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              id="user-search"
              type="text"
              className="form-input"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select id="role-filter" className="form-input" style={{ width: 'auto', minWidth: 130 }}
            value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value as any, page: 1 })}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select id="status-filter" className="form-input" style={{ width: 'auto', minWidth: 140 }}
            value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value as any, page: 1 })}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-container">
          <table>
            <thead style={{ background: 'var(--bg-card)' }}>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 18, borderRadius: 6 }} /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <AlertTriangle size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontSize: 13, fontWeight: 700,
                        }}>
                          {user.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 13 }} className="text-primary">{user.fullName}</p>
                          <p style={{ fontSize: 12 }} className="text-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                    <td><span className={`badge badge-${user.status}`}>{user.status}</span></td>
                    <td style={{ fontSize: 13 }} className="text-secondary">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ fontSize: 13 }} className="text-secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          id={`toggle-status-${user._id}`}
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                          onClick={() => toggleStatus(user)}
                          disabled={updateMutation.isPending}
                          title={user.status === 'active' ? 'Suspend' : 'Activate'}
                          style={{ fontSize: 11 }}
                        >
                          {user.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
                        </button>
                        <button
                          id={`toggle-role-${user._id}`}
                          className="btn btn-sm btn-secondary"
                          onClick={() => toggleRole(user)}
                          disabled={updateMutation.isPending}
                          title={`Make ${user.role === 'admin' ? 'user' : 'admin'}`}
                          style={{ fontSize: 11 }}
                        >
                          <Shield size={12} /> {user.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          id={`delete-user-${user._id}`}
                          className="btn btn-sm btn-ghost"
                          onClick={() => {
                            if (confirm(`Delete ${user.fullName}? This cannot be undone.`)) {
                              deleteMutation.mutate(user._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          style={{ color: '#f87171', fontSize: 11 }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            <button
              id="prev-page-btn"
              className="btn btn-secondary btn-sm"
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            >← Prev</button>
            <span className="btn btn-ghost btn-sm" style={{ cursor: 'default' }}>
              Page {filters.page} of {pagination.totalPages}
            </span>
            <button
              id="next-page-btn"
              className="btn btn-secondary btn-sm"
              disabled={filters.page === pagination.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            >Next →</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsersPage;
