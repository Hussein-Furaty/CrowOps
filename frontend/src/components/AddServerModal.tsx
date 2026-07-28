import React, { useState } from 'react';
import type { CreateServerPayload } from '../types';
import { X, Server } from 'lucide-react';

interface AddServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateServerPayload) => Promise<void>;
}

export const AddServerModal: React.FC<AddServerModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [hostname, setHostname] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [sshPort, setSshPort] = useState(22);
  const [os, setOs] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        hostname,
        ipAddress,
        sshPort: Number(sshPort),
        os: os || undefined,
        description: description || undefined,
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
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={22} color="#3B82F6" />
          Add New Server
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Server Name *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Production Web 01"
                style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Hostname *</label>
              <input
                required
                type="text"
                value={hostname}
                onChange={(e) => setHostname(e.target.value)}
                placeholder="e.g. web-01.crowops.internal"
                style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>IP Address *</label>
              <input
                required
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.100"
                style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>SSH Port *</label>
              <input
                required
                type="number"
                value={sshPort}
                onChange={(e) => setSshPort(Number(e.target.value))}
                style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>OS / Environment</label>
            <input
              type="text"
              value={os}
              onChange={(e) => setOs(e.target.value)}
              placeholder="e.g. Ubuntu 22.04 LTS"
              style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional notes regarding this server..."
              style={{ width: '100%', padding: '0.6rem', background: '#0F172A', border: '1px solid #334155', borderRadius: '6px', color: '#FFF', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>

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
              style={{ padding: '0.6rem 1.25rem', background: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              {loading ? 'Creating...' : 'Save Server'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
