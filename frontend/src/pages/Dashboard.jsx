import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#1a1a2e' }}>{value}</div>
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

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
      <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#888', marginBottom: 28 }}>EE Department Dining Event Overview</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 24
      }}>
        <StatCard label="Total Students"  value={stats.total}      color="#4361ee" />
        <StatCard label="Meals Served"    value={stats.scanned}    color="#06d6a0" />
        <StatCard label="Not Yet Scanned" value={stats.remaining}  color="#ef233c" />
        <StatCard label="Emails Sent"     value={emailSent}        color="#f8961e" />
        <StatCard label="Emails Pending"  value={emailPending}     color="#adb5bd" />
      </div>

      {/* Progress bar */}
      <div style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Attendance Progress</span>
          <span style={{ fontSize: 14, color: '#888' }}>
            {stats.total ? Math.round((stats.scanned / stats.total) * 100) : 0}%
          </span>
        </div>
        <div style={{ background: '#f0f0f0', borderRadius: 8, height: 12 }}>
          <div style={{
            background: 'linear-gradient(90deg, #4361ee, #06d6a0)',
            width: `${stats.total ? (stats.scanned / stats.total) * 100 : 0}%`,
            height: '100%', borderRadius: 8, transition: 'width 0.5s'
          }} />
        </div>
      </div>
    </div>
  );
}