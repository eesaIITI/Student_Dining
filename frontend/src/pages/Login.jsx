import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  .dash {
    padding: 28px 28px 20px;
    font-family: 'Sora', sans-serif;
    max-width: 900px;
  }

  .dash-header { margin-bottom: 24px; }

  .dash-title {
    font-size: 22px;
    font-weight: 800;
    color: #0d0f1a;
    letter-spacing: -0.5px;
    margin: 0 0 2px;
  }

  .dash-sub {
    font-size: 13px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
  }

  /* Stat grid */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    background: #fff;
    border-radius: 14px;
    padding: 18px 16px;
    border: 1px solid #e8eaf6;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
    background: var(--c);
  }

  .stat-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    margin-bottom: 8px;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: var(--c);
    letter-spacing: -1px;
    line-height: 1;
    font-family: 'DM Mono', monospace;
  }

  /* Progress section */
  .progress-card {
    background: #fff;
    border-radius: 16px;
    padding: 22px 24px;
    border: 1px solid #e8eaf6;
    margin-bottom: 16px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .progress-title {
    font-size: 14px;
    font-weight: 700;
    color: #0d0f1a;
  }

  .progress-pct {
    font-size: 26px;
    font-weight: 800;
    color: #5b6ef5;
    font-family: 'DM Mono', monospace;
    letter-spacing: -1px;
  }

  .progress-track {
    background: #f0f2ff;
    border-radius: 100px;
    height: 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, #5b6ef5, #00e5a0);
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  .progress-sub {
    font-size: 12px;
    color: #8892b0;
    margin-top: 8px;
    font-family: 'DM Mono', monospace;
  }

  /* Email progress card */
  .dual-progress {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }

  .mini-card {
    background: #fff;
    border-radius: 14px;
    padding: 18px;
    border: 1px solid #e8eaf6;
    text-align: center;
  }

  .mini-donut-wrap {
    position: relative;
    width: 72px;
    height: 72px;
    margin: 0 auto 10px;
  }

  .mini-donut-wrap svg { transform: rotate(-90deg); }

  .mini-donut-center {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 800;
    font-family: 'DM Mono', monospace;
    color: #0d0f1a;
  }

  .mini-card-label {
    font-size: 11px;
    font-weight: 700;
    color: #8892b0;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    font-family: 'DM Mono', monospace;
  }

  @media (max-width: 768px) {
    .dash { padding: 20px 16px 12px; }
    .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .stat-value { font-size: 28px; }
    .dual-progress { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 400px) {
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

function DonutMini({ value, total, color }) {
  const pct = total ? value / total : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="mini-donut-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="#f0f2ff" strokeWidth="8" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="mini-donut-center">{total ? Math.round(pct * 100) : 0}%</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, scanned: 0, remaining: 0 });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/scan/stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/students').then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const emailSent    = students.filter(s => s.emailSent).length;
  const emailPending = students.length - emailSent;
  const attendPct    = stats.total ? Math.round((stats.scanned / stats.total) * 100) : 0;

  const statCards = [
    { label: 'Total',     value: stats.total,     color: '#5b6ef5' },
    { label: 'Attended',  value: stats.scanned,   color: '#00e5a0' },
    { label: 'Remaining', value: stats.remaining,  color: '#ff4d6a' },
    { label: 'Emailed',   value: emailSent,        color: '#ffb830' },
    { label: 'Pending',   value: emailPending,     color: '#8892b0' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="dash">
        <div className="dash-header">
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-sub">EE Annual Dining · Live Overview</p>
        </div>

        <div className="stat-grid">
          {statCards.map(s => (
            <div key={s.label} className="stat-card" style={{ '--c': s.color }}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="progress-card">
          <div className="progress-header">
            <div>
              <div className="progress-title">Attendance Progress</div>
              <div className="progress-sub">{stats.scanned} of {stats.total} students scanned</div>
            </div>
            <div className="progress-pct">{attendPct}%</div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${attendPct}%` }} />
          </div>
        </div>

        <div className="dual-progress">
          <div className="mini-card">
            <DonutMini value={emailSent} total={students.length} color="#5b6ef5" />
            <div className="mini-card-label">Emails Sent</div>
          </div>
          <div className="mini-card">
            <DonutMini value={stats.scanned} total={stats.total} color="#00e5a0" />
            <div className="mini-card-label">Attended</div>
          </div>
        </div>
      </div>
    </>
  );
}