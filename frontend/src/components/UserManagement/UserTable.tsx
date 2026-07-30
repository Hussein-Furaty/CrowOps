import React from 'react';
import type { UserResponse, UserPageResponse } from '../../types';
import { Shield, ShieldAlert, Edit2, Key, Trash2, Power, Lock, Unlock } from 'lucide-react';

interface UserTableProps {
  userPage: UserPageResponse | null;
  loading: boolean;
  onEdit: (user: UserResponse) => void;
  onResetPassword: (user: UserResponse) => void;
  onDelete: (user: UserResponse) => void;
  onToggleStatus: (user: UserResponse) => void;
  onToggleLock: (user: UserResponse) => void;
  onPageChange: (page: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ 
  userPage, loading, onEdit, onResetPassword, onDelete, onToggleStatus, onToggleLock, onPageChange 
}) => {

  if (loading && !userPage) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
        Loading users...
      </div>
    );
  }

  if (!userPage || userPage.content.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
        No users found.
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-light)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>User</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Created</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userPage.content.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--bg-card)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.firstName} {user.lastName}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>@{user.username} · {user.email}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                    background: user.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                    color: user.role === 'ADMIN' ? 'var(--brand-primary)' : 'var(--text-secondary)'
                  }}>
                    {user.role === 'ADMIN' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      background: user.enabled ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
                      color: user.enabled ? 'var(--status-success)' : 'var(--status-danger)'
                    }}>
                      {user.enabled ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    {user.locked && (
                      <span style={{ 
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                        background: 'var(--status-warning-bg)',
                        color: 'var(--status-warning)'
                      }}>
                        LOCKED
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => onToggleStatus(user)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title={user.enabled ? "Deactivate" : "Activate"}>
                      <Power size={18} color={user.enabled ? 'var(--text-tertiary)' : 'var(--status-success)'} />
                    </button>
                    <button onClick={() => onToggleLock(user)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title={user.locked ? "Unlock" : "Lock"}>
                      {user.locked ? <Unlock size={18} color="var(--status-success)" /> : <Lock size={18} color="var(--status-warning)" />}
                    </button>
                    <button onClick={() => onResetPassword(user)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title="Reset Password">
                      <Key size={18} color="var(--brand-secondary)" />
                    </button>
                    <button onClick={() => onEdit(user)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title="Edit">
                      <Edit2 size={18} color="var(--brand-primary)" />
                    </button>
                    <button onClick={() => onDelete(user)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title="Delete">
                      <Trash2 size={18} color="var(--status-danger)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {userPage.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button 
            className="btn-secondary" 
            disabled={userPage.page === 0} 
            onClick={() => onPageChange(userPage.page - 1)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Prev
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Page {userPage.page + 1} of {userPage.totalPages}
          </span>
          <button 
            className="btn-secondary" 
            disabled={userPage.page === userPage.totalPages - 1} 
            onClick={() => onPageChange(userPage.page + 1)}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
