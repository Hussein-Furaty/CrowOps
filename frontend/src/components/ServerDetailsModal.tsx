import React, { useEffect, useState } from 'react';
import type { ServerResponse, ServerSystemInfo } from '../types';
import { axiosClient } from '../api/axiosClient';
import { 
  X, Activity, Cpu, HardDrive, Terminal, 
  Power, RefreshCw, Network, Server, Play, ShieldAlert
} from 'lucide-react';

interface ServerDetailsModalProps {
  server: ServerResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'processes' | 'network' | 'logs' | 'actions';

export const ServerDetailsModal: React.FC<ServerDetailsModalProps> = ({ server, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [metrics, setMetrics] = useState<ServerSystemInfo | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [ports, setPorts] = useState<string>('');
  const [processes, setProcesses] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Poll metrics every 5 seconds if Overview is active
  useEffect(() => {
    if (!isOpen || !server) return;
    
    let interval: NodeJS.Timeout;
    const fetchMetrics = async () => {
      try {
        const res = await axiosClient.get(`/api/servers/${server.id}/system-info`);
        setMetrics(res.data);
      } catch (err) {
        console.error('Failed to fetch metrics', err);
      }
    };

    if (activeTab === 'overview') {
      fetchMetrics(); // Initial fetch
      interval = setInterval(fetchMetrics, 5000); // Live poll every 5s
    }

    return () => clearInterval(interval);
  }, [isOpen, server, activeTab]);

  // Fetch data based on tab
  useEffect(() => {
    if (!isOpen || !server) return;

    const fetchTabData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'logs') {
          const res = await axiosClient.get(`/api/servers/${server.id}/logs?lines=50`);
          setLogs(res.data.logs || 'No logs available.');
        } else if (activeTab === 'network') {
          const res = await axiosClient.get(`/api/servers/${server.id}/ports`);
          setPorts(res.data.ports || 'No ports found.');
        } else if (activeTab === 'processes') {
          const res = await axiosClient.get(`/api/servers/${server.id}/processes`);
          setProcesses(res.data.processes || 'No process info available.');
        }
      } catch (err) {
        console.error(`Failed to fetch data for ${activeTab}`, err);
      } finally {
        setLoading(false);
      }
    };

    if (['logs', 'network', 'processes'].includes(activeTab)) {
      fetchTabData();
    }
  }, [isOpen, server, activeTab]);

  if (!isOpen || !server) return null;

  const handleAction = async (actionCmd: string, confirmMsg: string) => {
    if (!window.confirm(confirmMsg)) return;
    setActionLoading(true);
    try {
      await axiosClient.post(`/api/servers/${server.id}/action`, { command: actionCmd });
      alert('Action executed successfully (check server logs/status).');
    } catch (err: any) {
      alert('Failed to execute action: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{ 
        width: '100%', maxWidth: '1000px', height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' 
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-light)', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Server color="var(--brand-primary)" />
              {server.name} <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: 'normal' }}>({server.ipAddress})</span>
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar Tabs */}
          <div style={{ 
            width: '200px', borderRight: '1px solid var(--border-light)', padding: '1rem 0',
            display: 'flex', flexDirection: 'column', gap: '0.25rem'
          }}>
            {[
              { id: 'overview', icon: Activity, label: 'Live Overview' },
              { id: 'processes', icon: Cpu, label: 'Processes' },
              { id: 'network', icon: Network, label: 'Network & Ports' },
              { id: 'logs', icon: Terminal, label: 'System Logs' },
              { id: 'actions', icon: Power, label: 'Power Actions' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1.5rem', width: '100%', border: 'none', textAlign: 'left',
                  background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderRight: activeTab === tab.id ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  cursor: 'pointer', fontWeight: activeTab === tab.id ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
            
            {loading && activeTab !== 'overview' && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand-primary)' }}>
                <RefreshCw className="animate-pulse" size={32} />
              </div>
            )}

            {!loading && activeTab === 'overview' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Live Server Metrics</h3>
                {!metrics ? (
                  <div style={{ color: 'var(--text-secondary)' }}>Loading metrics (waiting for first poll)...</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CPU Usage</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--brand-primary)' }}>{metrics.cpuUsage}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Memory</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--status-success)' }}>{metrics.memoryUsage}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Network Traffic (In / Out)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-info)' }}>
                        {metrics.networkIn} <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>in</span> / {metrics.networkOut} <span style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }}>out</span>
                      </div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Load Average (1m, 5m, 15m)</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--status-warning)' }}>{metrics.loadAverage}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '1.5rem', gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Uptime</div>
                        <div>{metrics.uptime}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>OS</div>
                        <div>{metrics.osInfo}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Disk Usage</div>
                        <div>{metrics.diskUsage}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!loading && activeTab === 'processes' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Top 20 Processes by CPU</h3>
                <pre style={{ 
                  background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', 
                  color: 'var(--status-success)', fontSize: '0.85rem', overflowX: 'auto', border: '1px solid var(--border-light)'
                }}>
                  {processes}
                </pre>
              </div>
            )}

            {!loading && activeTab === 'network' && (
              <div className="animate-fade-in">
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Listening TCP/UDP Ports</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {ports.split(',').filter(p => p.trim()).map((port, idx) => (
                    <div key={idx} style={{ 
                      background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--brand-primary)', 
                      padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--brand-primary)', fontWeight: 600 
                    }}>
                      Port {port}
                    </div>
                  ))}
                  {(!ports || ports === 'N/A') && <div>No port information available.</div>}
                </div>
              </div>
            )}

            {!loading && activeTab === 'logs' && (
              <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>System Logs (Last 50 lines)</h3>
                  <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer' }}>
                    <RefreshCw size={16} style={{ marginRight: '5px' }}/> Refresh
                  </button>
                </div>
                <pre style={{ 
                  background: '#000', padding: '1rem', borderRadius: '8px', flex: 1,
                  color: '#CBD5E1', fontSize: '0.8rem', overflowY: 'auto', border: '1px solid var(--border-light)', margin: 0
                }}>
                  {logs}
                </pre>
              </div>
            )}

            {activeTab === 'actions' && (
              <div className="animate-fade-in">
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.3)', 
                  padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={20} /> Danger Zone
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    These actions will be executed directly on the server via SSH as the authenticated user. Ensure you know what you are doing.
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      className="btn-danger"
                      disabled={actionLoading}
                      onClick={() => handleAction('sudo reboot || reboot', 'Are you ABSOLUTELY sure you want to REBOOT this server?')}
                    >
                      <RefreshCw size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
                      Reboot Server
                    </button>
                    <button 
                      className="btn-danger"
                      disabled={actionLoading}
                      onClick={() => handleAction('sudo shutdown -h now || poweroff', 'Are you ABSOLUTELY sure you want to SHUTDOWN this server?')}
                    >
                      <Power size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
                      Shutdown Server
                    </button>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Service Restart</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>Restart common services on Linux.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['nginx', 'apache2', 'mysql', 'postgresql', 'docker'].map(svc => (
                      <button 
                        key={svc} className="btn-secondary" disabled={actionLoading}
                        onClick={() => handleAction(`sudo systemctl restart ${svc} || sudo service ${svc} restart`, `Restart ${svc} service?`)}
                      >
                        <Play size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }}/>
                        Restart {svc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
