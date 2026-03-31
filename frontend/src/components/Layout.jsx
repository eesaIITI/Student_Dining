import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const nav = [
  { to: '/',            label: 'Dashboard', icon: '▦' },
  { to: '/students',    label: 'Students',  icon: '◈' },
  { to: '/scanner',     label: 'Scanner',   icon: '⬡' },
  { to: '/send-emails', label: 'Emails',    icon: '◎' },
];

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');`;

const css = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0d0f1a;
    --surface:   #13162b;
    --surface2:  #1b1f38;
    --accent:    #5b6ef5;
    --accent2:   #e94560;
    --text:      #eaeeff;
    --muted:     #6b7195;
    --border:    rgba(255,255,255,0.07);
    --green:     #00e5a0;
    --red:       #ff4d6a;
    --amber:     #ffb830;
    --card:      #ffffff;
    --card-text: #0d0f1a;
    --page-bg:   #f0f2ff;
    --font-ui:   'Sora', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  html, body, #root { height: 100%; }

  body {
    font-family: var(--font-ui);
    background: var(--page-bg);
    color: var(--card-text);
    -webkit-font-smoothing: antialiased;
  }

  /* ── Sidebar layout (≥768px) ── */
  .app-shell {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 220px;
    min-width: 220px;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
  }

  .sidebar-brand {
    padding: 28px 20px 20px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-brand .wordmark {
    font-family: var(--font-mono);
    font-size: 17px;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sidebar-brand .wordmark .bolt {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: var(--accent);
    border-radius: 7px;
    font-size: 14px;
    flex-shrink: 0;
  }

  .sidebar-brand .subtitle {
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
    font-family: var(--font-mono);
  }

  .sidebar-nav {
    flex: 1;
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    text-decoration: none;
    transition: all 0.15s;
    position: relative;
    letter-spacing: 0.1px;
  }

  .nav-link:hover { background: var(--surface); color: var(--text); }

  .nav-link.active {
    background: var(--surface2);
    color: var(--text);
  }

  .nav-link .nav-icon {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    font-size: 15px;
    flex-shrink: 0;
  }

  .nav-link.active .nav-icon { background: var(--accent); }
  .nav-link:not(.active) .nav-icon { background: var(--surface2); }

  .sidebar-footer {
    padding: 12px 10px 20px;
    border-top: 1px solid var(--border);
  }

  .user-chip {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--surface);
    border-radius: 10px;
    margin-bottom: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 500;
    color: #fff;
    flex-shrink: 0;
  }

  .user-info .name {
    font-size: 12px;
    font-weight: 600;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  .user-info .role {
    font-size: 10px;
    color: var(--muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .logout-btn {
    width: 100%;
    padding: 9px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 8px;
    font-size: 12px;
    font-family: var(--font-ui);
    cursor: pointer;
    transition: all 0.15s;
  }

  .logout-btn:hover { background: var(--accent2); border-color: var(--accent2); color: #fff; }

  /* ── Main content ── */
  .main-content {
    flex: 1;
    min-width: 0;
    background: var(--page-bg);
    overflow-y: auto;
    /* space for mobile bottom nav */
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* ── Mobile top bar ── */
  .mobile-topbar {
    display: none;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
    padding: 14px 16px;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .mobile-wordmark {
    font-family: var(--font-mono);
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mobile-wordmark .bolt {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: var(--accent);
    border-radius: 6px;
    font-size: 13px;
  }

  .mobile-logout {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 11px;
    font-family: var(--font-ui);
    cursor: pointer;
  }

  /* ── Mobile bottom nav ── */
  .bottom-nav {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--bg);
    border-top: 1px solid var(--border);
    padding: 8px 4px calc(8px + env(safe-area-inset-bottom));
    z-index: 100;
  }

  .bottom-nav-inner {
    display: flex;
    justify-content: space-around;
  }

  .bottom-nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 6px 16px;
    color: var(--muted);
    text-decoration: none;
    border-radius: 10px;
    transition: all 0.15s;
    min-width: 60px;
  }

  .bottom-nav-link .bn-icon {
    font-size: 18px;
    line-height: 1;
  }

  .bottom-nav-link .bn-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .bottom-nav-link.active {
    color: var(--accent);
  }

  .bottom-nav-link.active .bn-icon {
    background: rgba(91,110,245,0.15);
    border-radius: 8px;
    padding: 4px 8px;
  }

  /* ── Responsive breakpoint ── */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .mobile-topbar { display: flex; }
    .bottom-nav { display: block; }
    .main-content { padding-bottom: calc(70px + env(safe-area-inset-bottom)); }
  }
`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'A';

  return (
    <>
      <style>{css}</style>
      <div className="app-shell">
        {/* Desktop Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="wordmark">
              <span className="bolt">⚡</span>
              EE Dining
            </div>
            <div className="subtitle">Admin Panel</div>
          </div>

          <nav className="sidebar-nav">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="name">{user?.name || 'Admin'}</div>
                <div className="role">{user?.role || 'admin'}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </div>
        </aside>

        {/* Main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Mobile top bar */}
          <div className="mobile-topbar">
            <div className="mobile-wordmark">
              <span className="bolt">⚡</span>
              EE Dining
            </div>
            <button className="mobile-logout" onClick={handleLogout}>Sign out</button>
          </div>

          <main className="main-content">
            <Outlet />
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}
              >
                <span className="bn-icon">{n.icon}</span>
                <span className="bn-label">{n.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}