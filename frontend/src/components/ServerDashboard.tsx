import React, { useEffect, useState } from 'react';
import { axiosClient } from '../api/axiosClient';
import type { CreateServerPayload, SaveSshCredentialPayload, ServerResponse, ServerSystemInfo } from '../types';
import { AddServerModal } from './AddServerModal';
import { SshCredentialModal } from './SshCredentialModal';
import {
  Server as ServerIcon,
  Plus,
  RefreshCw,
  LogOut,
  Key,
  Wifi,
  Trash2,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface ServerDashboardProps {
  onLogout: () => void;
}

export const ServerDashboard: React.FC<ServerDashboardProps> = ({ onLogout }) => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedServerForSsh, setSelectedServerForSsh] = useState<ServerResponse | null>(null);
  const [systemInfos, setSystemInfos] = useState<Record<number, ServerSystemInfo>>({});
  const [testingConnection, setTestingConnection] = useState<Record<number, boolean>>({});
  const [connectionStatus, setConnectionStatus] = useState<Record<number, boolean | null>>({});

  const fetchServers = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/api/servers');
      setServers(response.data);
    } catch (err) {
      console.error('Failed to fetch servers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleAddServer = async (payload: CreateServerPayload) => {
    await axiosClient.post('/api/servers', payload);
    await fetchServers();
  };

  const handleSaveSshCredentials = async (serverId: number, payload: SaveSshCredentialPayload) => {
    await axiosClient.put(`/api/servers/${serverId}/ssh-credentials`, payload);
  };

  const handleDeleteServer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      await axiosClient.delete(`/api/servers/${id}`);
      await fetchServers();
    }
  };

  const handleTestSshConnection = async (serverId: number) => {
    setTestingConnection(prev => ({ ...prev, [serverId]: true }));
    setConnectionStatus(prev => ({ ...prev, [serverId]: null }));
    try {
      const res = await axiosClient.post(`/api/servers/${serverId}/ssh-credentials/test`);
      setConnectionStatus(prev => ({ ...prev, [serverId]: res.data }));
    } catch (err) {
      setConnectionStatus(prev => ({ ...prev, [serverId]: false }));
    } finally {
      setTestingConnection(prev => ({ ...prev, [serverId]: false }));
    }
  };

  const handleFetchMetrics = async (serverId: number) => {
    try {
      const res = await axiosClient.get(`/api/servers/${serverId}/system-info`);
      setSystemInfos(prev => ({ ...prev, [serverId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch system metrics', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F17', color: '#F8FAFC' }}>
      {/* Top Navbar */}
      <header style={{
        background: 'rgba(18, 24, 36, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '8px', color: '#3B82F6' }}>
            <ServerIcon size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>CrowOps Dashboard</h1>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Enterprise Server & Infrastructure Control</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.25rem',
              background: '#3B82F6',
              color: '#FFF',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            Add Server
          </button>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Infrastructure Overview</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.875rem' }}>Managing {servers.length} server instances</p>
          </div>

          <button
            onClick={fetchServers}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#1E293B',
              color: '#CBD5E1',
              border: '1px solid #334155',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} />
            Refresh List
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94A3B8' }}>Loading infrastructure data...</div>
        ) : servers.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <ServerIcon size={48} color="#64748B" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>No servers registered yet</h3>
            <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>Start by adding your first server to manage SSH credentials and metrics.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{ padding: '0.75rem 1.5rem', background: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Add Your First Server
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {servers.map((server) => {
              const metrics = systemInfos[server.id];
              const isTesting = testingConnection[server.id];
              const testResult = connectionStatus[server.id];

              return (
                <div key={server.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{server.name}</h3>
                        <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace' }}>{server.ipAddress}:{server.sshPort}</span>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: server.enabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: server.enabled ? '#34D399' : '#FCA5A5'
                      }}>
                        {server.enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                      <div><strong style={{ color: '#64748B' }}>Hostname:</strong> {server.hostname}</div>
                      {server.os && <div><strong style={{ color: '#64748B' }}>OS:</strong> {server.os}</div>}
                    </div>

                    {/* System Metrics Box */}
                    {metrics ? (
                      <div style={{ background: '#0F172A', padding: '0.875rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div><Cpu size={14} color="#60A5FA" /> <strong>CPU:</strong> {metrics.cpuUsage}</div>
                        <div><Activity size={14} color="#34D399" /> <strong>RAM:</strong> {metrics.memoryUsage}</div>
                        <div><HardDrive size={14} color="#F59E0B" /> <strong>Disk:</strong> {metrics.diskUsage}</div>
                        <div><Clock size={14} color="#C084FC" /> <strong>Uptime:</strong> {metrics.uptime}</div>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    {/* SSH Status Feedback */}
                    {testResult !== undefined && testResult !== null && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        marginBottom: '1rem',
                        background: testResult ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: testResult ? '#34D399' : '#FCA5A5'
                      }}>
                        {testResult ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        <span>{testResult ? 'SSH Connection Successful' : 'SSH Connection Failed'}</span>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem' }}>
                      <button
                        onClick={() => setSelectedServerForSsh(server)}
                        title="Configure SSH Credentials"
                        style={{ flex: 1, padding: '0.5rem', background: '#1E293B', color: '#94A3B8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.775rem' }}
                      >
                        <Key size={14} /> SSH Keys
                      </button>

                      <button
                        onClick={() => handleTestSshConnection(server.id)}
                        disabled={isTesting}
                        title="Test SSH Connection"
                        style={{ flex: 1, padding: '0.5rem', background: '#1E293B', color: '#60A5FA', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.775rem' }}
                      >
                        <Wifi size={14} /> {isTesting ? 'Testing...' : 'Test Conn'}
                      </button>

                      <button
                        onClick={() => handleFetchMetrics(server.id)}
                        title="Fetch Live System Info"
                        style={{ padding: '0.5rem', background: '#1E293B', color: '#34D399', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Activity size={14} />
                      </button>

                      <button
                        onClick={() => handleDeleteServer(server.id)}
                        title="Delete Server"
                        style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AddServerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddServer}
      />

      <SshCredentialModal
        server={selectedServerForSsh}
        isOpen={!!selectedServerForSsh}
        onClose={() => setSelectedServerForSsh(null)}
        onSubmit={handleSaveSshCredentials}
      />
    </div>
  );
};
