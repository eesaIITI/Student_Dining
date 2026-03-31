import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/',            label: '📊 Dashboard' },
  { to: '/students',    label: '🎓 Students' },
  { to: '/scanner',     label: '📷 QR Scanner' },
  { to: '/send-emails', label: '📧 Send Emails' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  // Close sidebar on outside click
  useEffect(() => {
    if (!sidebarOpen) return;
    const handler = (e) => {
      if (!e.target.closest('#sidebar') && !e.target.closest('#hamburger')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [sidebarOpen]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`
        @media (max-width: 768px) {
          #sidebar {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            width: 240px !important;
          }
          #sidebar.open {
            transform: translateX(0) !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.3);
          }
          #main-content {
            margin-left: 0 !important;
          }
          #topbar {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          #topbar { display: none !important; }
          #overlay { display: none !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div id="overlay" onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 199, display: 'block'
          }} />
      )}

      {/* Sidebar */}
      <aside id="sidebar" className={sidebarOpen ? 'open' : ''}
        style={{
          width: 220, background: '#1a1a2e', color: '#eee',
          display: 'flex', flexDirection: 'column', padding: '24px 0',
          flexShrink: 0
        }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>⚡ EE Dining</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{user?.name} · {user?.role}</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}
              style={({ isActive }) => ({
                display: 'block', padding: '12px 20px', color: isActive ? '#fff' : '#aaa',
                background: isActive ? '#16213e' : 'transparent',
                textDecoration: 'none', fontSize: 14,
                borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
                minHeight: 44, boxSizing: 'border-box'
              })}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout}
          style={{
            margin: '0 20px', padding: '10px', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
            fontSize: 13, minHeight: 44
          }}>
          Logout
        </button>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div id="topbar" style={{
          display: 'none', alignItems: 'center', gap: 12,
          background: '#1a1a2e', padding: '12px 16px',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <button id="hamburger" onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 4, display: 'flex', flexDirection: 'column',
              gap: 5, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center'
            }}>
            <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 22, height: 2, background: '#fff', borderRadius: 2 }} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>⚡ EE Dining</span>
        </div>

        {/* Main content */}
        <main id="main-content"
          style={{ flex: 1, background: '#f4f6fb', overflowY: 'auto', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}