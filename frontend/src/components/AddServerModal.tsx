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
        name, hostname, ipAddress, sshPort: Number(sshPort),
        os: os || undefined, description: description || undefined,
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
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.35rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={22} color="var(--brand-primary)" /> Add New Server
        </h3>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Server Name *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prod Web 01" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Hostname *</label>
              <input required type="text" value={hostname} onChange={(e) => setHostname(e.target.value)} placeholder="e.g. web-01.local" className="input-field" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>IP Address *</label>
              <input required type="text" value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} placeholder="192.168.1.100" className="input-field" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>SSH Port *</label>
              <input required type="number" value={sshPort} onChange={(e) => setSshPort(Number(e.target.value))} className="input-field" />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>OS / Environment</label>
            <input type="text" value={os} onChange={(e) => setOs(e.target.value)} placeholder="e.g. Ubuntu 22.04 LTS" className="input-field" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional notes..." className="input-field" style={{ resize: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Creating...' : 'Save Server'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
