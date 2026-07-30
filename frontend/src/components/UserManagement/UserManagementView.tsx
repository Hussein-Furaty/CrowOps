import React, { useState, useEffect, useCallback } from 'react';
import { userApi } from '../../api/userApi';
import type { UserResponse, UserPageResponse } from '../../types';
import { UserTable } from './UserTable';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { ResetPasswordModal } from './ResetPasswordModal';
import { DeleteUserConfirmModal } from './DeleteUserConfirmModal';
import { Users, Plus, Search, RefreshCw } from 'lucide-react';
import _debounce from 'lodash/debounce';

export const UserManagementView: React.FC = () => {
  const [userPage, setUserPage] = useState<UserPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [resetUser, setResetUser] = useState<UserResponse | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);

  const fetchUsers = async (page = currentPage, query = searchQuery) => {
    setLoading(true);
    try {
      const data = await userApi.getUsers(page, 20, query);
      setUserPage(data);
      setCurrentPage(data.page);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, '');
  }, []);

  const debouncedSearch = useCallback(
    _debounce((query: string) => {
      fetchUsers(0, query);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleToggleStatus = async (user: UserResponse) => {
    try {
      if (user.enabled) {
        await userApi.deactivateUser(user.id);
      } else {
        await userApi.activateUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleToggleLock = async (user: UserResponse) => {
    try {
      if (user.locked) {
        await userApi.unlockUser(user.id);
      } else {
        await userApi.lockUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle lock', err);
    }
  };

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={28} color="var(--brand-primary)" /> User Management
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {userPage ? `Managing ${userPage.totalElements} users` : 'Loading users...'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={() => fetchUsers()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn-primary" onClick={() => setIsCreateOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add User
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={18} color="var(--text-tertiary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search users by name, username, or email..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="input-field" 
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
        </div>

        <UserTable 
          userPage={userPage} 
          loading={loading}
          onEdit={setEditUser}
          onResetPassword={setResetUser}
          onDelete={setDeleteUser}
          onToggleStatus={handleToggleStatus}
          onToggleLock={handleToggleLock}
          onPageChange={(page) => fetchUsers(page)}
        />
      </div>

      {/* Modals */}
      <CreateUserModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={async (payload) => {
          await userApi.createUser(payload);
          fetchUsers();
        }} 
      />

      <EditUserModal 
        user={editUser}
        isOpen={!!editUser} 
        onClose={() => setEditUser(null)} 
        onSubmit={async (id, payload) => {
          await userApi.updateUser(id, payload);
          fetchUsers();
        }} 
      />

      <ResetPasswordModal 
        user={resetUser}
        isOpen={!!resetUser} 
        onClose={() => setResetUser(null)} 
        onSubmit={async (id, payload) => {
          await userApi.resetPassword(id, payload);
        }} 
      />

      <DeleteUserConfirmModal 
        user={deleteUser}
        isOpen={!!deleteUser} 
        onClose={() => setDeleteUser(null)} 
        onConfirm={async (id) => {
          await userApi.deleteUser(id);
          fetchUsers();
        }} 
      />
    </div>
  );
};
