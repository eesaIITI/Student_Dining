import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  .students {
    padding: 24px 24px 16px;
    font-family: 'Sora', sans-serif;
    max-width: 1000px;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 20px;
    gap: 12px;
    flex-wrap: wrap;
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
  }

  .header-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    border: none;
    text-decoration: none;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.2px;
  }

  .btn-primary {
    background: #5b6ef5;
    color: #fff;
    box-shadow: 0 2px 8px rgba(91,110,245,0.3);
  }
  .btn-primary:hover { background: #4a5de4; }

  .btn-ghost {
    background: #fff;
    color: #0d0f1a;
    border: 1px solid #e0e3f0;
  }
  .btn-ghost:hover { border-color: #5b6ef5; color: #5b6ef5; }

  .btn-danger {
    background: transparent;
    color: #ff4d6a;
    border: 1px solid #ffd0d8;
    padding: 5px 10px;
    font-size: 11px;
  }
  .btn-danger:hover { background: #ff4d6a; color: #fff; border-color: #ff4d6a; }

  .btn-outline-sm {
    background: transparent;
    color: #5b6ef5;
    border: 1px solid #c7cef8;
    padding: 5px 10px;
    font-size: 11px;
  }
  .btn-outline-sm:hover { background: #5b6ef5; color: #fff; }

  /* Add form */
  .add-form-wrap {
    background: #fff;
    border: 1px solid #e0e3f0;
    border-radius: 14px;
    padding: 20px;
    margin-bottom: 16px;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .add-form-title {
    font-size: 13px;
    font-weight: 700;
    color: #0d0f1a;
    margin-bottom: 14px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }

  .form-input {
    padding: 9px 12px;
    border: 1px solid #e0e3f0;
    border-radius: 8px;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    color: #0d0f1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
    background: #f8f9ff;
  }

  .form-input:focus {
    border-color: #5b6ef5;
    box-shadow: 0 0 0 3px rgba(91,110,245,0.1);
    background: #fff;
  }

  .form-actions { display: flex; gap: 8px; }

  /* Search */
  .search-wrap {
    position: relative;
    margin-bottom: 16px;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #8892b0;
    font-size: 14px;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border: 1px solid #e0e3f0;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    outline: none;
    background: #fff;
    color: #0d0f1a;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-input:focus {
    border-color: #5b6ef5;
    box-shadow: 0 0 0 3px rgba(91,110,245,0.1);
  }

  .search-input::placeholder { color: #aab2cc; }

  /* Desktop table */
  .table-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e0e3f0;
    overflow: hidden;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .data-table thead tr {
    background: #f8f9ff;
  }

  .data-table th {
    padding: 11px 14px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    border-bottom: 1px solid #e8eaf6;
  }

  .data-table td {
    padding: 10px 14px;
    border-bottom: 1px solid #f4f5fb;
    vertical-align: middle;
  }

  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: #fafbff; }

  .cell-name { font-weight: 600; color: #0d0f1a; }
  .cell-mono { font-family: 'DM Mono', monospace; font-size: 12px; color: #5b6478; }
  .cell-email { color: #5b6ef5; font-size: 12px; }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }

  .badge-green { background: #e6fdf5; color: #00875a; }
  .badge-red   { background: #fff0f2; color: #cc1638; }
  .badge-gray  { background: #f4f5fb; color: #6b7195; }

  .row-actions { display: flex; gap: 6px; }

  /* Mobile card list */
  .mobile-list { display: none; }

  .student-card {
    background: #fff;
    border-radius: 14px;
    border: 1px solid #e0e3f0;
    padding: 16px;
    margin-bottom: 10px;
    transition: box-shadow 0.15s;
  }

  .student-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

  .sc-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .sc-name {
    font-size: 15px;
    font-weight: 700;
    color: #0d0f1a;
    margin-bottom: 2px;
  }

  .sc-meta {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #8892b0;
  }

  .sc-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .sc-email {
    font-size: 12px;
    color: #5b6ef5;
    font-family: 'DM Mono', monospace;
    margin-bottom: 12px;
    word-break: break-all;
  }

  .sc-actions { display: flex; gap: 8px; }

  .table-footer {
    padding: 10px 14px;
    font-size: 12px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    border-top: 1px solid #f4f5fb;
  }

  /* Empty state */
  .empty-state {
    text-align: center;
    padding: 48px 20px;
    color: #8892b0;
    font-size: 14px;
  }

  .empty-icon { font-size: 40px; margin-bottom: 12px; }

  /* QR Modal */
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
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px 28px;
    text-align: center;
    width: 100%;
    max-width: 300px;
    animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 24px 60px rgba(0,0,0,0.3);
  }

  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.9) translateY(16px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-name {
    font-size: 17px;
    font-weight: 800;
    color: #0d0f1a;
    margin-bottom: 2px;
  }

  .modal-sub {
    font-size: 12px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    margin-bottom: 20px;
  }

  .qr-img {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    border: 3px solid #f0f2ff;
    margin: 0 auto 14px;
    display: block;
  }

  .modal-hint {
    font-size: 11px;
    color: #aab2cc;
    margin-bottom: 20px;
    font-family: 'DM Mono', monospace;
  }

  @media (max-width: 640px) {
    .students { padding: 16px 12px 12px; }
    .table-card { display: none; }
    .mobile-list { display: block; }
    .header-actions { width: 100%; justify-content: flex-end; }
    .page-header { flex-direction: column; }
  }

  @media (max-width: 400px) {
    .header-actions { flex-direction: column; }
    .btn { width: 100%; justify-content: center; }
  }
`;

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', rollNumber: '', department: '', year: 1 });
  const [search, setSearch]     = useState('');
  const [qrModal, setQrModal]   = useState(null);

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

  const fields = [
    ['name', 'Full Name'],
    ['email', 'Email'],
    ['rollNumber', 'Roll No'],
    ['department', 'Department'],
  ];

  return (
    <>
      <style>{css}</style>
      <div className="students">
        <div className="page-header">
          <div>
            <h1 className="page-title">Students</h1>
            <p className="page-sub">{students.length} registered</p>
          </div>
          <div className="header-actions">
            <label className="btn btn-ghost">
              📁 Import CSV
              <input type="file" accept=".csv" onChange={handleBulkCSV} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
              + Add Student
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="add-form-wrap">
            <div className="add-form-title">New Student</div>
            <form onSubmit={handleAdd}>
              <div className="form-grid">
                {fields.map(([k, l]) => (
                  <input
                    key={k}
                    className="form-input"
                    placeholder={l}
                    value={form[k]}
                    onChange={e => setForm({ ...form, [k]: e.target.value })}
                    required={['name', 'email', 'rollNumber'].includes(k)}
                  />
                ))}
                <select
                  className="form-input"
                  value={form.year}
                  onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            placeholder="Search by name, roll no, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Desktop table */}
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                {['Name', 'Roll No', 'Email', 'Dept', 'Yr', 'Email', 'Status', ''].map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#8892b0' }}>
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#8892b0' }}>
                    No students found
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s._id}>
                  <td className="cell-name">{s.name}</td>
                  <td className="cell-mono">{s.rollNumber}</td>
                  <td className="cell-email">{s.email}</td>
                  <td className="cell-mono">{s.department}</td>
                  <td className="cell-mono">Y{s.year}</td>
                  <td>
                    <span className={`badge ${s.emailSent ? 'badge-green' : 'badge-red'}`}>
                      {s.emailSent ? '✓ Sent' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${s.isScanned ? 'badge-green' : 'badge-gray'}`}>
                      {s.isScanned ? '✓ Scanned' : 'Not yet'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-outline-sm" onClick={() => handleViewQR(s._id)}>QR</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(s._id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && (
            <div className="table-footer">{filtered.length} student{filtered.length !== 1 ? 's' : ''}</div>
          )}
        </div>

        {/* Mobile card list */}
        <div className="mobile-list">
          {loading ? (
            <div className="empty-state"><div className="empty-icon">⏳</div>Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">🎓</div>No students found</div>
          ) : filtered.map(s => (
            <div key={s._id} className="student-card">
              <div className="sc-top">
                <div>
                  <div className="sc-name">{s.name}</div>
                  <div className="sc-meta">{s.rollNumber} · {s.department} · Y{s.year}</div>
                </div>
              </div>
              <div className="sc-email">{s.email}</div>
              <div className="sc-badges">
                <span className={`badge ${s.emailSent ? 'badge-green' : 'badge-red'}`}>
                  {s.emailSent ? '✓ Email Sent' : 'Email Pending'}
                </span>
                <span className={`badge ${s.isScanned ? 'badge-green' : 'badge-gray'}`}>
                  {s.isScanned ? '✓ Scanned' : 'Not Scanned'}
                </span>
              </div>
              <div className="sc-actions">
                <button className="btn btn-outline-sm" onClick={() => handleViewQR(s._id)}>View QR</button>
                <button className="btn btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
              </div>
            </div>
          ))}
          {!loading && (
            <p style={{ fontSize: 12, color: '#8892b0', fontFamily: 'DM Mono, monospace', marginTop: 8, textAlign: 'center' }}>
              {filtered.length} student{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {qrModal && (
        <div className="modal-overlay" onClick={() => setQrModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-name">{qrModal.name}</div>
            <div className="modal-sub">{qrModal.rollNumber} · {qrModal.department}</div>
            <img src={qrModal.qrCode} alt="QR Code" className="qr-img" />
            <div className="modal-hint">Show this at the dining entrance</div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setQrModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}