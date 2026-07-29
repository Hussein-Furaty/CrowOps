import React, { useState } from 'react';
import type { SaveSshCredentialPayload, ServerResponse } from '../types';
import { X, Key, Lock, User } from 'lucide-react';

interface SshCredentialModalProps {
  server: ServerResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serverId: number, payload: SaveSshCredentialPayload) => Promise<void>;
}

export const SshCredentialModal: React.FC<SshCredentialModalProps> = ({ server, isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState('root');
  const [authType, setAuthType] = useState<'PASSWORD' | 'KEY'>('PASSWORD');
  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !server) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(server.id, {
        username, authType,
        password: authType === 'PASSWORD' ? password : undefined,
        privateKey: authType === 'KEY' ? privateKey : undefined,
        passphrase: authType === 'KEY' ? passphrase : undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={22} color="var(--status-success)" /> SSH Credentials
        </h3>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {server.name} — {server.ipAddress}:{server.sshPort}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>SSH Username *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="root" className="input-field" style={{ paddingLeft: '2.5rem' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Authentication Type *</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <input type="radio" name="authType" value="PASSWORD" checked={authType === 'PASSWORD'} onChange={() => setAuthType('PASSWORD')} />
                Password
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <input type="radio" name="authType" value="KEY" checked={authType === 'KEY'} onChange={() => setAuthType('KEY')} />
                Private Key
              </label>
            </div>
          </div>

          {authType === 'PASSWORD' ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>SSH Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter SSH password" className="input-field" style={{ paddingLeft: '2.5rem' }} />
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Private Key (PEM format)</label>
                <textarea rows={4} value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="-----BEGIN RSA PRIVATE KEY-----..." className="input-field" style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Key Passphrase (Optional)</label>
                <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} placeholder="Enter passphrase if key is encrypted" className="input-field" />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ background: 'var(--status-success)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
              {loading ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
