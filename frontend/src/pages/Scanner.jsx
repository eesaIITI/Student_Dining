import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';

export default function Scanner() {
  const [result, setResult]     = useState(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [recentList, setRecent] = useState([]);
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
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
    const config = { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 };

    html5QrRef.current.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => handleScan(decodedText),
      () => {}
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
    <div style={{ padding: 'clamp(16px, 4vw, 24px)', maxWidth: 520, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>QR Scanner</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Scan student dining passes at the entrance</p>

      {/* Camera box */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 'clamp(12px, 4vw, 20px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 16
      }}>
        <div id="qr-reader" ref={scannerRef}
          style={{ width: '100%', minHeight: scanning ? 280 : 0, overflow: 'hidden', borderRadius: 10 }} />

        {!scanning && !result && !loading && (
          <div style={{ textAlign: 'center', padding: 'clamp(20px, 6vw, 32px) 0' }}>
            <div style={{ fontSize: 56, marginBottom: 10 }}>📷</div>
            <p style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>Point camera at student QR code</p>
            <button onClick={startScanner} style={{
              background: '#4361ee', color: '#fff', border: 'none', borderRadius: 10,
              padding: '14px 40px', fontSize: 16, fontWeight: 600, cursor: 'pointer',
              minHeight: 48, width: '100%', maxWidth: 280
            }}>
              Start Scanning
            </button>
          </div>
        )}

        {scanning && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>Scanning… align QR in the box</div>
            <button onClick={stopScanner} style={{
              background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 8,
              padding: '10px 24px', cursor: 'pointer', fontSize: 13, minHeight: 44
            }}>Stop</button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '28px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <p style={{ color: '#888' }}>Validating…</p>
          </div>
        )}

        {/* Result card */}
        {result && !loading && (
          <div style={{
            borderRadius: 12, padding: 'clamp(16px, 5vw, 24px)', textAlign: 'center',
            background: result.success ? '#f0fdf4' : '#fff1f2',
            border: `1px solid ${result.success ? '#86efac' : '#fca5a5'}`
          }}>
            <div style={{ fontSize: 48, marginBottom: 6 }}>{result.success ? '✅' : '❌'}</div>
            <div style={{ fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: 700, color: result.success ? '#15803d' : '#b91c1c', marginBottom: 4 }}>
              {result.success ? 'Access Granted' : 'Access Denied'}
            </div>
            {result.student && (
              <>
                <div style={{ fontSize: 'clamp(15px, 4vw, 18px)', fontWeight: 600, color: '#1a1a2e', marginTop: 10 }}>{result.student.name}</div>
                <div style={{ fontSize: 13, color: '#555' }}>{result.student.rollNumber} · {result.student.department}</div>
              </>
            )}
            <div style={{ fontSize: 13, color: '#888', margin: '8px 0 14px' }}>{result.message}</div>
            <button onClick={resetScan} style={{
              background: '#4361ee', color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 28px', fontSize: 14, cursor: 'pointer', fontWeight: 600,
              minHeight: 46, width: '100%', maxWidth: 220
            }}>Scan Next</button>
          </div>
        )}
      </div>

      {/* Recent scans */}
      {recentList.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(14px, 4vw, 20px)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 12 }}>Recent scans</h3>
          {recentList.map((r, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < recentList.length - 1 ? '1px solid #f0f0f0' : 'none',
              gap: 8
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{r.success ? '✅' : '❌'}</span>
                <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.student?.name || 'Unknown'}
                  {r.student?.rollNumber && <span style={{ color: '#888', fontWeight: 400 }}> · {r.student.rollNumber}</span>}
                </span>
              </div>
              <span style={{ fontSize: 12, color: '#aaa', flexShrink: 0 }}>{r.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}