import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  .send-emails {
    padding: 24px 24px 16px;
    font-family: 'Sora', sans-serif;
    max-width: 900px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 800;
    color: #0d0f1a;
    letter-spacing: -0.5px;
    margin: 0 0 2px;
  }

  .page-sub {
    font-size: 12px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    margin-bottom: 24px;
  }

  /* Config card */
  .config-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e0e3f0;
    padding: 24px;
    margin-bottom: 20px;
  }

  .field-label {
    font-size: 10px;
    font-weight: 700;
    color: #8892b0;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-family: 'DM Mono', monospace;
    display: block;
    margin-bottom: 6px;
  }

  .event-input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #e0e3f0;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    color: #0d0f1a;
    outline: none;
    background: #f8f9ff;
    transition: border-color 0.15s, box-shadow 0.15s;
    margin-bottom: 20px;
  }

  .event-input:focus {
    border-color: #5b6ef5;
    box-shadow: 0 0 0 3px rgba(91,110,245,0.1);
    background: #fff;
  }

  /* Stat row */
  .stat-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }

  .stat-pill {
    background: #f8f9ff;
    border-radius: 12px;
    padding: 14px 12px;
    text-align: center;
    border: 1px solid #e8eaf6;
  }

  .stat-pill .val {
    font-size: 28px;
    font-weight: 800;
    font-family: 'DM Mono', monospace;
    color: var(--c);
    letter-spacing: -1px;
    line-height: 1;
  }

  .stat-pill .lbl {
    font-size: 10px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  /* Send button */
  .send-btn {
    width: 100%;
    padding: 14px;
    background: #5b6ef5;
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.2px;
    box-shadow: 0 4px 16px rgba(91,110,245,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .send-btn:hover:not(:disabled) {
    background: #4a5de4;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(91,110,245,0.4);
  }

  .send-btn:disabled { background: #c4c9e8; cursor: default; box-shadow: none; }

  /* Result banner */
  .result-banner {
    margin-top: 14px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    color: #0d0f1a;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .result-ok  { background: #e6fdf5; border: 1px solid #9feccf; }
  .result-err { background: #fff0f2; border: 1px solid #ffb3c1; }

  /* Student list */
  .list-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e0e3f0;
    overflow: hidden;
  }

  .list-header {
    padding: 14px 18px;
    border-bottom: 1px solid #f0f2fc;
    font-size: 13px;
    font-weight: 700;
    color: #0d0f1a;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .list-header .count {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #8892b0;
    font-weight: 400;
  }

  /* Desktop table */
  .email-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .email-table thead tr { background: #f8f9ff; }

  .email-table th {
    padding: 10px 14px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    border-bottom: 1px solid #e8eaf6;
  }

  .email-table td {
    padding: 10px 14px;
    border-bottom: 1px solid #f4f5fb;
    vertical-align: middle;
  }

  .email-table tr:last-child td { border-bottom: none; }
  .email-table tr:hover td { background: #fafbff; }

  .cell-name  { font-weight: 600; color: #0d0f1a; }
  .cell-mono  { font-family: 'DM Mono', monospace; font-size: 12px; color: #5b6478; }
  .cell-email-addr { color: #5b6ef5; font-size: 12px; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  .badge-green { background: #e6fdf5; color: #00875a; }
  .badge-red   { background: #fff0f2; color: #cc1638; }

  .action-btns { display: flex; gap: 6px; }

  .btn-sm {
    padding: 5px 10px;
    border-radius: 7px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }

  .btn-outline { background: transparent; border: 1px solid #e0e3f0; color: #0d0f1a; }
  .btn-outline:hover { border-color: #5b6ef5; color: #5b6ef5; }

  .btn-blue { background: transparent; border: 1px solid #c7cef8; color: #5b6ef5; }
  .btn-blue:hover { background: #5b6ef5; color: #fff; }

  /* Mobile card list */
  .mobile-list { display: none; }

  .email-student-card {
    padding: 14px 16px;
    border-bottom: 1px solid #f4f5fb;
  }

  .email-student-card:last-child { border-bottom: none; }

  .esc-name { font-size: 14px; font-weight: 700; color: #0d0f1a; margin-bottom: 2px; }
  .esc-sub  { font-size: 11px; color: #8892b0; font-family: 'DM Mono', monospace; margin-bottom: 6px; }
  .esc-email-addr { font-size: 12px; color: #5b6ef5; font-family: 'DM Mono', monospace; margin-bottom: 10px; word-break: break-all; }
  .esc-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }

  /* QR modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13,15,26,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  .modal-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px 24px;
    text-align: center;
    width: 100%;
    max-width: 300px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.3);
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }

  .modal-name { font-size: 17px; font-weight: 800; color: #0d0f1a; margin-bottom: 2px; }
  .modal-sub  { font-size: 12px; color: #8892b0; font-family: 'DM Mono', monospace; margin-bottom: 20px; }

  .qr-img {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    border: 3px solid #f0f2ff;
    display: block;
    margin: 0 auto 14px;
  }

  .modal-hint {
    font-size: 11px;
    color: #aab2cc;
    margin-bottom: 20px;
    font-family: 'DM Mono', monospace;
  }

  .btn-primary {
    width: 100%;
    background: #5b6ef5;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 11px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .send-emails { padding: 16px 12px 12px; }
    .email-table { display: none; }
    .mobile-list { display: block; }
    .stat-pill .val { font-size: 22px; }
  }
`;

export default function SendEmails() {
  const [students, setStudents] = useState([]);
  const [eventName, setEventName] = useState('EE Department Annual Dining 2025');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
  }, []);

  const pending = students.filter(s => !s.emailSent);
  const sent    = students.filter(s => s.emailSent);

  const sendAll = async () => {
    if (!eventName.trim()) return alert('Enter event name first');
    if (!pending.length)   return alert('No pending emails');
    if (!window.confirm(`Send QR emails to ${pending.length} students?`)) return;
    setSending(true);
    setResult(null);
    try {
      const r = await api.post('/email/send-all', { eventName });
      setResult(r.data);
      const updated = await api.get('/students');
      setStudents(updated.data);
    } catch (err) {
      setResult({ message: err.response?.data?.message || 'Error sending emails' });
    } finally {
      setSending(false);
    }
  };

  const resend = async (student) => {
    if (!window.confirm(`Resend QR to ${student.name}?`)) return;
    try {
      await api.post(`/email/send/${student._id}`, { eventName });
      alert(`Sent to ${student.email}`);
      const updated = await api.get('/students');
      setStudents(updated.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="send-emails">
        <h1 className="page-title">Send QR Emails</h1>
        <p className="page-sub">Bulk-send personalized dining passes</p>

        <div className="config-card">
          <label className="field-label">Event Name</label>
          <input
            className="event-input"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
          />

          <div className="stat-row">
            {[
              { lbl: 'Total',   val: students.length, c: '#5b6ef5' },
              { lbl: 'Pending', val: pending.length,  c: '#ff4d6a' },
              { lbl: 'Sent',    val: sent.length,     c: '#00e5a0' },
            ].map(s => (
              <div key={s.lbl} className="stat-pill" style={{ '--c': s.c }}>
                <div className="val">{s.val}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <button className="send-btn" onClick={sendAll} disabled={sending || !pending.length}>
            {sending
              ? <><span>⏳</span> Sending…</>
              : <><span>📧</span> Send to {pending.length} pending</>
            }
          </button>

          {result && (
            <div className={`result-banner ${result.failed ? 'result-err' : 'result-ok'}`}>
              {result.message}
              {result.sent !== undefined && ` · ✅ ${result.sent} sent, ❌ ${result.failed} failed`}
            </div>
          )}
        </div>

        {/* Student list */}
        <div className="list-card">
          <div className="list-header">
            All Students
            <span className="count">{students.length} total</span>
          </div>

          {/* Desktop table */}
          <table className="email-table">
            <thead>
              <tr>
                {['Name', 'Roll No', 'Email', 'Status', 'Actions'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td className="cell-name">{s.name}</td>
                  <td className="cell-mono">{s.rollNumber}</td>
                  <td className="cell-email-addr">{s.email}</td>
                  <td>
                    <span className={`badge ${s.emailSent ? 'badge-green' : 'badge-red'}`}>
                      {s.emailSent
                        ? `✓ ${s.emailSentAt ? new Date(s.emailSentAt).toLocaleDateString() : 'Sent'}`
                        : 'Pending'
                      }
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-sm btn-outline" onClick={() => setSelected(s)}>Preview QR</button>
                      <button className="btn-sm btn-blue" onClick={() => resend(s)}>Resend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="mobile-list">
            {students.map(s => (
              <div key={s._id} className="email-student-card">
                <div className="esc-name">{s.name}</div>
                <div className="esc-sub">{s.rollNumber} · {s.department}</div>
                <div className="esc-email-addr">{s.email}</div>
                <div className="esc-row">
                  <span className={`badge ${s.emailSent ? 'badge-green' : 'badge-red'}`}>
                    {s.emailSent
                      ? `✓ ${s.emailSentAt ? new Date(s.emailSentAt).toLocaleDateString() : 'Sent'}`
                      : 'Pending'
                    }
                  </span>
                  <div className="action-btns">
                    <button className="btn-sm btn-outline" onClick={() => setSelected(s)}>QR</button>
                    <button className="btn-sm btn-blue" onClick={() => resend(s)}>Resend</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-name">{selected.name}</div>
            <div className="modal-sub">{selected.rollNumber} · {selected.department}</div>
            {selected.qrCode
              ? <img src={selected.qrCode} alt="QR Code" className="qr-img" />
              : <p style={{ color: '#8892b0', marginBottom: 16 }}>QR not generated yet</p>
            }
            <div className="modal-hint">Unique to this student</div>
            <button className="btn-primary" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}