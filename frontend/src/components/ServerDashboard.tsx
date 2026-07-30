import React, { useEffect, useState } from 'react';
import { axiosClient } from '../api/axiosClient';
import type { CreateServerPayload, SaveSshCredentialPayload, ServerResponse, ServerSystemInfo } from '../types';
import { AddServerModal } from './AddServerModal';
import { SshCredentialModal } from './SshCredentialModal';
import { ServerDetailsModal } from './ServerDetailsModal';
import {
  Server as ServerIcon, Plus, RefreshCw, Key, Wifi, Trash2, Cpu, HardDrive, Activity, 
  CheckCircle, XCircle, Clock, Settings
} from 'lucide-react';

interface ServerDashboardProps {
}

export const ServerDashboard: React.FC<ServerDashboardProps> = () => {
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedServerForSsh, setSelectedServerForSsh] = useState<ServerResponse | null>(null);
  const [selectedServerForDetails, setSelectedServerForDetails] = useState<ServerResponse | null>(null);
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
      if (res.data) {
        handleFetchMetrics(serverId); // fetch metrics automatically on success
      }
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
    <div style={{ minHeight: '100%' }}>
      {/* Main Content */}
      <main style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>Overview</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Managing {servers.length} server instances</p>
          </div>
          <button className="btn-primary" onClick={() => setIsAddModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '1rem' }}>
            <Plus size={16} /> Add Server
          </button>
          <button className="btn-secondary" onClick={fetchServers} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--brand-primary)' }}>
            <RefreshCw className="animate-pulse" size={40} style={{ margin: '0 auto' }}/>
          </div>
        ) : servers.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <ServerIcon size={64} color="var(--text-tertiary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>No servers registered</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Start building your infrastructure by adding a server.</p>
            <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>Add Your First Server</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
            {servers.map((server) => {
              const metrics = systemInfos[server.id];
              const isTesting = testingConnection[server.id];
              const testResult = connectionStatus[server.id];

              return (
                <div key={server.id} className="glass-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ cursor: 'pointer' }} onClick={() => setSelectedServerForDetails(server)}>
                        <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>{server.name}</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{server.ipAddress}:{server.sshPort}</span>
                      </div>
                      <span style={{
                        padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                        background: server.enabled ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
                        color: server.enabled ? 'var(--status-success)' : 'var(--status-danger)'
                      }}>
                        {server.enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>

                    {metrics ? (
                      <div style={{ 
                        background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px', 
                        fontSize: '0.85rem', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                        border: '1px solid var(--border-light)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Cpu size={16} color="var(--brand-primary)" /> <strong>CPU:</strong> {metrics.cpuUsage}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} color="var(--status-success)" /> <strong>RAM:</strong> {metrics.memoryUsage}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><HardDrive size={16} color="var(--status-warning)" /> <strong>Disk:</strong> {metrics.diskUsage}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={16} color="var(--brand-secondary)" /> <strong>Up:</strong> {metrics.uptime}</div>
                      </div>
                    ) : (
                      <div style={{ 
                        background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '10px', 
                        fontSize: '0.85rem', marginBottom: '1.25rem', color: 'var(--text-tertiary)', textAlign: 'center',
                        border: '1px dashed var(--border-light)'
                      }}>
                        No metrics. Test SSH to fetch.
                      </div>
                    )}
                  </div>

                  <div>
                    {testResult !== undefined && testResult !== null && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '8px', 
                        fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500,
                        background: testResult ? 'var(--status-success-bg)' : 'var(--status-danger-bg)',
                        color: testResult ? 'var(--status-success)' : 'var(--status-danger)'
                      }}>
                        {testResult ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        <span>{testResult ? 'SSH Connection Successful' : 'SSH Connection Failed'}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                      <button className="btn-secondary" onClick={() => setSelectedServerForDetails(server)} title="Manage Server" style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.8rem', background: 'var(--brand-primary)', color: 'white', borderColor: 'var(--brand-primary)' }}>
                        <Settings size={14} /> Manage
                      </button>

                      <button className="btn-secondary" onClick={() => setSelectedServerForSsh(server)} title="SSH Keys" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Key size={16} />
                      </button>

                      <button className="btn-secondary" onClick={() => handleTestSshConnection(server.id)} disabled={isTesting} title="Test Connection" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                        {isTesting ? <RefreshCw className="animate-pulse" size={16} /> : <Wifi size={16} />}
                      </button>

                      <button className="btn-secondary" onClick={() => handleDeleteServer(server.id)} title="Delete Server" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AddServerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddServer} />
      <SshCredentialModal server={selectedServerForSsh} isOpen={!!selectedServerForSsh} onClose={() => setSelectedServerForSsh(null)} onSubmit={handleSaveSshCredentials} />
      <ServerDetailsModal server={selectedServerForDetails} isOpen={!!selectedServerForDetails} onClose={() => setSelectedServerForDetails(null)} />
    </div>
  );
};
