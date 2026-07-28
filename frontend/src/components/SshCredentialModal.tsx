import React, { useState } from 'react';
import { SaveSshCredentialPayload, ServerResponse } from '../types';
import { X, Key, Lock, User } from 'lucide-react';

interface SshCredentialModalProps {
  server: ServerResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serverId: number, payload: SaveSshCredentialPayload) => Promise<void>;
}

export const SshCredentialModal: React.FC<SshCredentialModalProps> = ({
  server,
  isOpen,
  onClose,
  onSubmit,
}) => {
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
        username,
        authType,
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
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={22} color="#10B981" />
          SSH Credentials for {server.name}
        </h3>
        <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#94A3B8' }}>
          {server.ipAddress}:{server.sshPort}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>SSH Username *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="root"
                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Authentication Type *</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#FFF', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="authType"
                  value="PASSWORD"
                  checked={authType === 'PASSWORD'}
                  onChange={() => setAuthType('PASSWORD')}
                />
                Password
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#FFF', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="authType"
                  value="KEY"
                  checked={authType === 'KEY'}
                  onChange={() => setAuthType('KEY')}
                />
                Private Key
              </label>
            </div>
          </div>

          {authType === 'PASSWORD' ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>SSH Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter SSH password"
                  style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Private Key (PEM format)</label>
                <textarea
                  rows={4}
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                  placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                  style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Key Passphrase (Optional)</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter passphrase if key is encrypted"
                  style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.25rem', background: '#334155', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '0.6rem 1.25rem', background: '#10B981', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              {loading ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
