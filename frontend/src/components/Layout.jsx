import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#1a1a2e', color: '#eee',
        display: 'flex', flexDirection: 'column', padding: '24px 0'
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>⚡ EE Dining</div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{user?.name} · {user?.role}</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {nav.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'}
              style={({ isActive }) => ({
                display: 'block', padding: '10px 20px', color: isActive ? '#fff' : '#aaa',
                background: isActive ? '#16213e' : 'transparent',
                textDecoration: 'none', fontSize: 14, borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent'
              })}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout}
          style={{ margin: '0 20px', padding: '8px', background: '#e94560',
            color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: '#f4f6fb', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
