import React, { useState } from 'react';
import type { UserResponse } from '../../types';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteUserConfirmModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export const DeleteUserConfirmModal: React.FC<DeleteUserConfirmModalProps> = ({ user, isOpen, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--status-danger-bg)', padding: '0.75rem', borderRadius: '50%' }}>
            <AlertTriangle size={24} color="var(--status-danger)" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>Delete User</h3>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Are you sure you want to delete user <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>? This action cannot be undone.
        </p>

        {error && (
          <div style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>Cancel</button>
          <button type="button" onClick={handleConfirm} disabled={loading} className="btn-danger">
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
