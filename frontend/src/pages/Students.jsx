import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Students() {
  const [students, setStudents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', rollNumber: '', department: '', year: 1 });
  const [search, setSearch]       = useState('');
  const [qrModal, setQrModal]     = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    const r = await api.get('/students');
    setStudents(r.data);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/students', form);
    setForm({ name: '', email: '', rollNumber: '', department: '', year: 1 });
    setShowAdd(false);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    await api.delete(`/students/${id}`);
    fetchStudents();
  };

  const handleViewQR = async (id) => {
    const r = await api.get(`/students/${id}`);
    setQrModal(r.data);
  };

  const handleBulkCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const lines = evt.target.result.trim().split('\n').slice(1);
      const students = lines.map(l => {
        const [name, email, rollNumber, department, year] = l.split(',').map(s => s.trim());
        return { name, email, rollNumber, department: department || '', year: Number(year) || 1 };
      });
      await api.post('/students/bulk', { students });
      fetchStudents();
    };
    reader.readAsText(file);
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 'clamp(16px, 4vw, 32px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>Students</h1>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, minHeight: 40, display: 'flex', alignItems: 'center' }}>
            📁 Import CSV
            <input type="file" accept=".csv" onChange={handleBulkCSV} style={{ display: 'none' }} />
          </label>
          <button onClick={() => setShowAdd(!showAdd)}
            style={{ background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 13, minHeight: 40 }}>
            + Add Student
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: '#fff', borderRadius: 12, padding: 'clamp(14px, 4vw, 20px)', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {[['name','Name'],['email','Email'],['rollNumber','Roll No'],['department','Dept']].map(([k,l]) => (
              <input key={k} placeholder={l} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
                required={['name','email','rollNumber'].includes(k)}
                style={{ padding: '10px 12px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 13, minHeight: 42 }} />
            ))}
            <select value={form.year} onChange={e => setForm({...form,year:Number(e.target.value)})}
              style={{ padding: '10px 12px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 13, minHeight: 42 }}>
              {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={{ background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 13, minHeight: 42 }}>Save</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 8, padding: '10px 18px', cursor: 'pointer', fontSize: 13, minHeight: 42 }}>Cancel</button>
          </div>
        </form>
      )}

      {/* Search */}
      <input placeholder="Search by name, roll no, email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', border: '1px solid #dee2e6', borderRadius: 10, fontSize: 14, marginBottom: 14, minHeight: 44 }} />

      {/* Table — scrollable on mobile */}
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['Name','Roll No','Email','Dept','Year','Email Sent','Status','Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 600, color: '#555', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Loading...</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s._id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 ? '#fafafa' : '#fff' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 500, whiteSpace: 'nowrap' }}>{s.name}</td>
                  <td style={{ padding: '10px 14px', color: '#555', whiteSpace: 'nowrap' }}>{s.rollNumber}</td>
                  <td style={{ padding: '10px 14px', color: '#4361ee', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.email}</td>
                  <td style={{ padding: '10px 14px', color: '#555' }}>{s.department}</td>
                  <td style={{ padding: '10px 14px', color: '#555' }}>Y{s.year}</td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ background: s.emailSent ? '#d1fae5' : '#fee2e2', color: s.emailSent ? '#065f46' : '#991b1b', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {s.emailSent ? '✓ Sent' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    <span style={{ background: s.isScanned ? '#d1fae5' : '#f3f4f6', color: s.isScanned ? '#065f46' : '#555', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {s.isScanned ? '✓ Scanned' : 'Not yet'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleViewQR(s._id)} style={{ background: 'transparent', border: '1px solid #dee2e6', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, minHeight: 32 }}>QR</button>
                      <button onClick={() => handleDelete(s._id)} style={{ background: 'transparent', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, minHeight: 32 }}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''}</p>

      {/* QR Modal */}
      {qrModal && (
        <div onClick={() => setQrModal(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 5vw, 32px)', textAlign: 'center', maxWidth: 320, width: '100%' }}>
            <h3 style={{ margin: '0 0 4px' }}>{qrModal.name}</h3>
            <p style={{ color: '#888', fontSize: 13, margin: '0 0 16px' }}>{qrModal.rollNumber} · {qrModal.department}</p>
            <img src={qrModal.qrCode} alt="QR" style={{ width: '100%', maxWidth: 240, height: 'auto', borderRadius: 8 }} />
            <p style={{ color: '#888', fontSize: 12, marginTop: 12 }}>Show this at the dining entrance</p>
            <button onClick={() => setQrModal(null)}
              style={{ marginTop: 14, background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', minHeight: 44, width: '100%', maxWidth: 200 }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}