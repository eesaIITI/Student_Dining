import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function SendEmails() {
  const [students, setStudents]   = useState([]);
  const [eventName, setEventName] = useState('EE Department Annual Dining 2025');
  const [sending, setSending]     = useState(false);
  const [result, setResult]       = useState(null);
  const [selected, setSelected]   = useState(null); // student for preview

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data));
  }, []);

  const pending  = students.filter(s => !s.emailSent);
  const sent     = students.filter(s =>  s.emailSent);

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
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>Send QR Emails</h1>
      <p style={{ color: '#888', marginBottom: 28 }}>Bulk-send personalized QR dining passes to students</p>

      {/* Config card */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 6 }}>Event Name</label>
        <input value={eventName} onChange={e => setEventName(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14, marginBottom: 16 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Total', value: students.length, color: '#4361ee' },
            { label: 'Pending', value: pending.length, color: '#ef4444' },
            { label: 'Sent', value: sent.length, color: '#06d6a0' },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: '#f8f9fa', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={sendAll} disabled={sending || !pending.length}
          style={{
            background: pending.length ? '#4361ee' : '#adb5bd', color: '#fff',
            border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15,
            fontWeight: 600, cursor: pending.length ? 'pointer' : 'default', width: '100%'
          }}>
          {sending ? '⏳ Sending emails…' : `📧 Send to ${pending.length} pending students`}
        </button>

        {result && (
          <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 8,
            background: result.failed ? '#fff1f2' : '#f0fdf4',
            border: `1px solid ${result.failed ? '#fca5a5' : '#86efac'}`,
            fontSize: 13, color: '#333' }}>
            {result.message}
            {result.sent !== undefined && ` — ✅ ${result.sent} sent, ❌ ${result.failed} failed`}
          </div>
        )}
      </div>

      {/* Student list */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', fontSize: 14, fontWeight: 600, color: '#555' }}>
          All Students
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {['Name', 'Roll No', 'Email', 'Email Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s._id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 ? '#fafafa' : '#fff' }}>
                <td style={{ padding: '10px 16px', fontWeight: 500 }}>{s.name}</td>
                <td style={{ padding: '10px 16px', color: '#555' }}>{s.rollNumber}</td>
                <td style={{ padding: '10px 16px', color: '#4361ee' }}>{s.email}</td>
                <td style={{ padding: '10px 16px' }}>
                  <span style={{
                    background: s.emailSent ? '#d1fae5' : '#fee2e2',
                    color: s.emailSent ? '#065f46' : '#991b1b',
                    padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500
                  }}>
                    {s.emailSent ? `✓ Sent ${s.emailSentAt ? new Date(s.emailSentAt).toLocaleDateString() : ''}` : 'Pending'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setSelected(s)}
                      style={{ background: 'transparent', border: '1px solid #dee2e6', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                      Preview QR
                    </button>
                    <button onClick={() => resend(s)}
                      style={{ background: 'transparent', border: '1px solid #c7d2fe', color: '#4361ee', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12 }}>
                      Resend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* QR Preview Modal */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', maxWidth: 340, width: '90%' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{selected.name}</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{selected.rollNumber} · {selected.department}</div>
            {selected.qrCode
              ? <img src={selected.qrCode} alt="QR" style={{ width: 220, height: 220, borderRadius: 8, border: '1px solid #eee' }} />
              : <p style={{ color: '#888' }}>QR not generated yet</p>
            }
            <p style={{ fontSize: 12, color: '#aaa', margin: '12px 0' }}>This QR is unique to this student</p>
            <button onClick={() => setSelected(null)}
              style={{ background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
