import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';

export default function Scanner() {
  const [result, setResult]     = useState(null); // { success, message, student }
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [recentList, setRecent] = useState([]);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
    // Load html5-qrcode from CDN
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
    script.onload = () => console.log('QR lib loaded');
    document.head.appendChild(script);
    return () => {
      stopScanner();
      document.head.removeChild(script);
    };
  }, []);

  const startScanner = () => {
    if (!window.Html5Qrcode) return alert('QR library not loaded yet, please wait a moment.');
    setResult(null);
    setScanning(true);

    html5QrRef.current = new window.Html5Qrcode('qr-reader');
    const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 };

    html5QrRef.current.start(
      { facingMode: 'environment' }, // prefer rear camera on mobile
      config,
      (decodedText) => handleScan(decodedText),
      () => {} // ignore per-frame errors
    ).catch(err => {
      console.error(err);
      setScanning(false);
      alert('Could not access camera. Please allow camera permission.');
    });
  };

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const handleScan = async (decodedText) => {
    if (loading) return;
    setLoading(true);
    await stopScanner();

    try {
      const r = await api.post('/scan', { qrPayload: decodedText });
      const entry = { ...r.data, time: new Date().toLocaleTimeString() };
      setResult(entry);
      setRecent(prev => [entry, ...prev.slice(0, 9)]);
    } catch (err) {
      const errData = err.response?.data || { success: false, message: 'Network error' };
      const entry = { ...errData, time: new Date().toLocaleTimeString() };
      setResult(entry);
      setRecent(prev => [entry, ...prev.slice(0, 9)]);
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => { setResult(null); };

  return (
    <div style={{ padding: 24, maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>QR Scanner</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Scan student dining passes at the entrance</p>

      {/* Camera box */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 20 }}>
        <div id="qr-reader" ref={scannerRef} style={{ width: '100%', minHeight: scanning ? 300 : 0, overflow: 'hidden', borderRadius: 10 }} />

        {!scanning && !result && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>📷</div>
            <p style={{ color: '#888', marginBottom: 20 }}>Point camera at student QR code</p>
            <button onClick={startScanner} style={{
              background: '#4361ee', color: '#fff', border: 'none', borderRadius: 10,
              padding: '14px 40px', fontSize: 16, fontWeight: 600, cursor: 'pointer'
            }}>
              Start Scanning
            </button>
          </div>
        )}

        {scanning && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>Scanning… align QR in the box</div>
            <button onClick={stopScanner} style={{
              background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 8,
              padding: '8px 20px', cursor: 'pointer', fontSize: 13
            }}>Stop</button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <p style={{ color: '#888' }}>Validating…</p>
          </div>
        )}

        {/* Result card */}
        {result && !loading && (
          <div style={{
            borderRadius: 12, padding: 24, textAlign: 'center',
            background: result.success ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${result.success ? '#86efac' : '#fca5a5'}`
          }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>{result.success ? '✅' : '❌'}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: result.success ? '#15803d' : '#b91c1c', marginBottom: 4 }}>
              {result.success ? 'Access Granted' : 'Access Denied'}
            </div>
            {result.student && (
              <>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginTop: 12 }}>{result.student.name}</div>
                <div style={{ fontSize: 14, color: '#555' }}>{result.student.rollNumber} · {result.student.department}</div>
              </>
            )}
            <div style={{ fontSize: 13, color: '#888', margin: '8px 0 16px' }}>{result.message}</div>
            <button onClick={resetScan} style={{
              background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 28px', fontSize: 14, cursor: 'pointer', fontWeight: 600
            }}>Scan Next</button>
          </div>
        )}
      </div>

      {/* Recent scans */}
      {recentList.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 12 }}>Recent scans</h3>
          {recentList.map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: i < recentList.length - 1 ? '1px solid #f0f0f0' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16 }}>{r.success ? '✅' : '❌'}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {r.student?.name || 'Unknown'}
                  {r.student?.rollNumber && <span style={{ color: '#888', fontWeight: 400 }}> · {r.student.rollNumber}</span>}
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#aaa' }}>{r.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
