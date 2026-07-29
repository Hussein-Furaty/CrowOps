import React, { useEffect, useState, useCallback } from 'react';
import type { ServerResponse, ServerSystemInfo } from '../types';
import { axiosClient } from '../api/axiosClient';
import {
  X, Activity, Cpu, HardDrive, Terminal,
  Power, RefreshCw, Network, Server, Play, ShieldAlert,
  Wifi, MemoryStick, Clock, Layers
} from 'lucide-react';

interface ServerDetailsModalProps {
  server: ServerResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'overview' | 'processes' | 'network' | 'logs' | 'actions';

// ─── helpers ───────────────────────────────────────────────────────────────
function parseCsv(raw: string): string[][] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.split(','));
}

function MetricCard({
  icon, label, value, color = 'var(--brand-primary)'
}: { icon: React.ReactNode; label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-light)',
      borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 500 }}>
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value || '—'}</div>
    </div>
  );
}

function DataTable({
  headers, rows, emptyMsg = 'No data available.'
}: { headers: string[]; rows: string[][]; emptyMsg?: string }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'rgba(99,102,241,0.1)' }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600,
                color: 'var(--brand-primary)', borderBottom: '1px solid var(--border-light)',
                whiteSpace: 'nowrap'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                {emptyMsg}
              </td>
            </tr>
          ) : rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)')}
            >
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '0.65rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)',
                  color: ci === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }} title={cell}>{cell || '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export const ServerDetailsModal: React.FC<ServerDetailsModalProps> = ({ server, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [metrics, setMetrics] = useState<ServerSystemInfo | null>(null);
  const [logs, setLogs] = useState<string>('');
  const [portRows, setPortRows] = useState<string[][]>([]);
  const [processRows, setProcessRows] = useState<string[][]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Live metrics poll every 5s on Overview tab
  useEffect(() => {
    if (!isOpen || !server) return;
    if (activeTab !== 'overview') return;

    let active = true;
    const fetch = async () => {
      try {
        const res = await axiosClient.get(`/api/servers/${server.id}/system-info`);
        if (active) setMetrics(res.data);
      } catch { /* silent */ }
    };

    fetch();
    const id = setInterval(fetch, 1000);
    return () => { active = false; clearInterval(id); };
  }, [isOpen, server, activeTab]);

  // Tab data fetch
  const fetchTab = useCallback(async () => {
    if (!server) return;
    setTabLoading(true);
    try {
      if (activeTab === 'logs') {
        const res = await axiosClient.get(`/api/servers/${server.id}/logs?lines=60`);
        setLogs(res.data.logs || 'No logs available.');
      } else if (activeTab === 'network') {
        const res = await axiosClient.get(`/api/servers/${server.id}/ports`);
        const rows = parseCsv(res.data.ports || '');
        setPortRows(rows.slice(1)); // skip header row
      } else if (activeTab === 'processes') {
        const res = await axiosClient.get(`/api/servers/${server.id}/processes`);
        const rows = parseCsv(res.data.processes || '');
        setProcessRows(rows.slice(1)); // skip header row
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTabLoading(false);
    }
  }, [server, activeTab]);

  useEffect(() => {
    if (!isOpen || !server) return;
    if (['logs', 'network', 'processes'].includes(activeTab)) fetchTab();
  }, [isOpen, server, activeTab, fetchTab]);

  if (!isOpen || !server) return null;

  const handleAction = async (cmd: string, confirmMsg: string) => {
    if (!window.confirm(confirmMsg)) return;
    setActionLoading(true);
    try {
      await axiosClient.post(`/api/servers/${server.id}/action`, { command: cmd });
      alert('Action sent. Check server status shortly.');
    } catch (err: any) {
      alert('Failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const tabs = [
    { id: 'overview',   icon: Activity,    label: 'Live Overview' },
    { id: 'processes',  icon: Cpu,         label: 'Processes' },
    { id: 'network',    icon: Network,     label: 'Network & Ports' },
    { id: 'logs',       icon: Terminal,    label: 'System Logs' },
    { id: 'actions',    icon: Power,       label: 'Power Actions' },
  ] as const;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1.5rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '1050px', height: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden'
      }}>
        {/* ── Header ── */}
        <div style={{
          padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--border-light)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', color: 'var(--brand-primary)' }}>
              <Server size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700 }}>{server.name}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                {server.ipAddress}:{server.sshPort}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: '8px', padding: '0.4rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{
            width: '190px', borderRight: '1px solid var(--border-light)',
            padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '2px',
            background: 'rgba(0,0,0,0.15)'
          }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                  padding: '0.7rem 1.25rem', width: '100%', border: 'none', textAlign: 'left',
                  background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderRight: active ? '3px solid var(--brand-primary)' : '3px solid transparent',
                  cursor: 'pointer', fontWeight: active ? 600 : 400, fontSize: '0.88rem',
                  transition: 'all 0.2s'
                }}>
                  <Icon size={17} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Loading spinner */}
            {tabLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, color: 'var(--brand-primary)' }}>
                <RefreshCw size={32} className="animate-pulse" />
              </div>
            )}

            {/* ── OVERVIEW ── */}
            {!tabLoading && activeTab === 'overview' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Live Server Metrics</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '7px', height: '7px', background: 'var(--status-success)', borderRadius: '50%', display: 'inline-block', animation: 'pulse-soft 1s infinite' }} />
                    Live Update (1s)
                  </span>
                </div>

                {!metrics ? (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Waiting for first poll...</div>
                ) : (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                      <MetricCard icon={<Cpu size={16} />}        label="CPU Usage"        value={metrics.cpuUsage}    color="var(--brand-primary)" />
                      <MetricCard icon={<MemoryStick size={16} />} label="Memory"           value={metrics.memoryUsage} color="var(--status-success)" />
                      <MetricCard icon={<HardDrive size={16} />}   label="Disk Usage"       value={metrics.diskUsage}   color="var(--status-warning)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                      <MetricCard icon={<Wifi size={16} />}    label="Network In"       value={metrics.networkIn}   color="var(--status-info)" />
                      <MetricCard icon={<Wifi size={16} />}    label="Network Out"      value={metrics.networkOut}  color="var(--status-info)" />
                      <MetricCard icon={<Activity size={16} />} label="Load (1m/5m/15m)" value={metrics.loadAverage} color="var(--status-warning)" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Clock size={14} /> Uptime
                        </div>
                        <div style={{ fontWeight: 600 }}>{metrics.uptime}</div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1.25rem' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Layers size={14} /> Processes Running
                        </div>
                        <div style={{ fontWeight: 600 }}>{metrics.processCount}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>OS: </strong>{metrics.osInfo}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── PROCESSES ── */}
            {!tabLoading && activeTab === 'processes' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Top 20 Processes by CPU</h3>
                  <button onClick={fetchTab} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <DataTable
                  headers={['User', 'PID', 'CPU%', 'MEM%', 'VSZ', 'RSS', 'Stat', 'Command']}
                  rows={processRows}
                  emptyMsg="No process data. Ensure SSH is configured."
                />
              </div>
            )}

            {/* ── NETWORK ── */}
            {!tabLoading && activeTab === 'network' && (
              <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Listening Sockets</h3>
                  <button onClick={fetchTab} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <DataTable
                  headers={['Protocol', 'State', 'Local Address', 'Port', 'Process']}
                  rows={portRows}
                  emptyMsg="No listening sockets found."
                />
              </div>
            )}

            {/* ── LOGS ── */}
            {!tabLoading && activeTab === 'logs' && (
              <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>System Logs (last 60 lines)</h3>
                  <button onClick={fetchTab} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                <pre style={{
                  background: '#000', border: '1px solid var(--border-light)', borderRadius: '10px',
                  padding: '1rem', margin: 0, flex: 1, overflowY: 'auto',
                  color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.7, fontFamily: 'monospace'
                }}>
                  {logs}
                </pre>
              </div>
            )}

            {/* ── ACTIONS ── */}
            {!tabLoading && activeTab === 'actions' && (
              <div className="animate-fade-in">
                <div style={{
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    <ShieldAlert size={20} /> Danger Zone
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                    Actions executed directly on the server via SSH. Confirm before proceeding.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-danger" disabled={actionLoading}
                      onClick={() => handleAction('sudo reboot || reboot', 'Reboot the server?')}>
                      <RefreshCw size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Reboot Server
                    </button>
                    <button className="btn-danger" disabled={actionLoading}
                      onClick={() => handleAction('sudo shutdown -h now || poweroff', 'Shutdown the server?')}>
                      <Power size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Shutdown Server
                    </button>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Restart Services</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: '0 0 1rem 0' }}>Restart common Linux services via systemctl.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['nginx', 'apache2', 'mysql', 'postgresql', 'docker', 'redis'].map(svc => (
                      <button key={svc} className="btn-secondary" disabled={actionLoading}
                        onClick={() => handleAction(`sudo systemctl restart ${svc}`, `Restart ${svc}?`)}
                        style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Play size={13} />
                        {svc}
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
