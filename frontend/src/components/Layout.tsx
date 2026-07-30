import React from 'react';
import { Server as ServerIcon, Users, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'servers' | 'users';
  onNavigate: (view: 'servers' | 'users') => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'var(--bg-panel)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-light)',
        padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '10px', color: 'var(--brand-primary)' }}>
              <ServerIcon size={26} />
            </div>
            <div>
              <h1 className="text-gradient" style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>CrowOps</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Enterprise Infrastructure</span>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => onNavigate('servers')}
              style={{
                background: currentView === 'servers' ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-primary)',
                fontWeight: currentView === 'servers' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <ServerIcon size={16} /> Servers
            </button>
            <button 
              onClick={() => onNavigate('users')}
              style={{
                background: currentView === 'users' ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-primary)',
                fontWeight: currentView === 'users' ? 600 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Users size={16} /> Users
            </button>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--status-danger)' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
};
