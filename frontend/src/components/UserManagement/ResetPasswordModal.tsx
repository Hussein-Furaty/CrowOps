import React, { useState } from 'react';
import type { ResetPasswordPayload, UserResponse } from '../../types';
import { X, Key } from 'lucide-react';

interface ResetPasswordModalProps {
  user: UserResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: ResetPasswordPayload) => Promise<void>;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, isOpen, onClose, onSubmit }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await onSubmit(user.id, {
        newPassword,
        confirmPassword
      });
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.35rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={22} color="var(--status-warning)" /> Reset Password
        </h3>
        
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Resetting password for user: <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
        </p>

        {error && (
          <div style={{ background: 'var(--status-danger-bg)', color: 'var(--status-danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>New Password *</label>
            <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" minLength={8} />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Confirm Password *</label>
            <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" minLength={8} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ background: 'var(--status-warning)', color: 'black' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
