import React, { useEffect, useRef, useState } from 'react';
import api from '../utils/api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  .scanner-page {
    padding: 24px 24px 16px;
    max-width: 520px;
    margin: 0 auto;
    font-family: 'Sora', sans-serif;
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

  /* Camera card */
  .camera-card {
    background: #fff;
    border-radius: 20px;
    border: 1px solid #e0e3f0;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  }

  .qr-reader-wrap {
    width: 100%;
    overflow: hidden;
    background: #0d0f1a;
    position: relative;
  }

  #qr-reader {
    width: 100% !important;
  }

  /* Override html5-qrcode default ugly styles */
  #qr-reader video { border-radius: 0 !important; }
  #qr-reader img   { display: none; }
  #qr-reader select { display: none !important; }

  /* Idle state */
  .idle-state {
    text-align: center;
    padding: 40px 24px;
  }

  .idle-icon {
    width: 80px;
    height: 80px;
    background: #f0f2ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin: 0 auto 16px;
  }

  .idle-text {
    font-size: 14px;
    color: #8892b0;
    margin-bottom: 20px;
    line-height: 1.5;
  }

  .start-btn {
    background: #5b6ef5;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 14px 36px;
    font-size: 15px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 16px rgba(91,110,245,0.35);
    letter-spacing: 0.2px;
  }

  .start-btn:hover {
    background: #4a5de4;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(91,110,245,0.45);
  }

  /* Scanning state */
  .scanning-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-top: 1px solid #f0f2fc;
  }

  .scanning-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
  }

  .pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #5b6ef5;
    animation: pulse 1.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  .stop-btn {
    background: #fff0f2;
    border: 1px solid #ffd0d8;
    color: #ff4d6a;
    border-radius: 8px;
    padding: 7px 14px;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }

  .stop-btn:hover { background: #ff4d6a; color: #fff; border-color: #ff4d6a; }

  /* Loading state */
  .loading-state {
    text-align: center;
    padding: 40px 24px;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #f0f2ff;
    border-top-color: #5b6ef5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 14px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text { font-size: 13px; color: #8892b0; font-family: 'DM Mono', monospace; }

  /* Result card */
  .result-card {
    padding: 28px 24px;
    text-align: center;
    animation: resultIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  @keyframes resultIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }

  .result-icon {
    font-size: 56px;
    margin-bottom: 12px;
    display: block;
  }

  .result-status {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
  }

  .result-status.ok  { color: #00875a; }
  .result-status.err { color: #cc1638; }

  .result-name {
    font-size: 16px;
    font-weight: 700;
    color: #0d0f1a;
    margin-bottom: 4px;
  }

  .result-meta {
    font-size: 12px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    margin-bottom: 6px;
  }

  .result-msg {
    font-size: 12px;
    color: #8892b0;
    margin-bottom: 20px;
    font-family: 'DM Mono', monospace;
  }

  .next-btn {
    background: #5b6ef5;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 11px 32px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 16px rgba(91,110,245,0.3);
  }

  .next-btn:hover { background: #4a5de4; }

  /* Recent scans */
  .recent-card {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e0e3f0;
    overflow: hidden;
  }

  .recent-header {
    padding: 14px 18px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
    border-bottom: 1px solid #f0f2fc;
  }

  .recent-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 18px;
    border-bottom: 1px solid #f4f5fb;
    transition: background 0.1s;
  }

  .recent-item:last-child { border-bottom: none; }
  .recent-item:hover { background: #fafbff; }

  .recent-left { display: flex; align-items: center; gap: 10px; }

  .recent-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }

  .recent-icon.ok  { background: #e6fdf5; }
  .recent-icon.err { background: #fff0f2; }

  .recent-name {
    font-size: 13px;
    font-weight: 600;
    color: #0d0f1a;
  }

  .recent-roll {
    font-size: 11px;
    color: #8892b0;
    font-family: 'DM Mono', monospace;
  }

  .recent-time {
    font-size: 11px;
    color: #aab2cc;
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .scanner-page { padding: 16px 12px 12px; }
  }
`;

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
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const startScanner = () => {
    if (!window.Html5Qrcode) return alert('QR library not loaded yet, please wait a moment.');
    setResult(null);
    setScanning(true);

    html5QrRef.current = new window.Html5Qrcode('qr-reader');
    const config = { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 };

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

  return (
    <>
      <style>{css}</style>
      <div className="scanner-page">
        <h1 className="page-title">QR Scanner</h1>
        <p className="page-sub">Scan student dining passes at the entrance</p>

        <div className="camera-card">
          {/* QR reader mount point */}
          {scanning && (
            <div className="qr-reader-wrap">
              <div id="qr-reader" ref={scannerRef} style={{ width: '100%' }} />
            </div>
          )}
          {!scanning && <div id="qr-reader" ref={scannerRef} style={{ display: 'none' }} />}

          {!scanning && !result && !loading && (
            <div className="idle-state">
              <div className="idle-icon">📷</div>
              <p className="idle-text">Point the camera at a student's QR code to validate their dining pass</p>
              <button className="start-btn" onClick={startScanner}>Start Scanning</button>
            </div>
          )}

          {scanning && (
            <div className="scanning-footer">
              <div className="scanning-indicator">
                <div className="pulse-dot" />
                Scanning… align QR in frame
              </div>
              <button className="stop-btn" onClick={stopScanner}>Stop</button>
            </div>
          )}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p className="loading-text">Validating pass…</p>
            </div>
          )}

          {result && !loading && (
            <div className="result-card" style={{
              background: result.success ? '#f0fdf8' : '#fff5f6',
              borderTop: `3px solid ${result.success ? '#00e5a0' : '#ff4d6a'}`
            }}>
              <span className="result-icon">{result.success ? '✅' : '❌'}</span>
              <div className={`result-status ${result.success ? 'ok' : 'err'}`}>
                {result.success ? 'Access Granted' : 'Access Denied'}
              </div>
              {result.student && (
                <>
                  <div className="result-name">{result.student.name}</div>
                  <div className="result-meta">{result.student.rollNumber} · {result.student.department}</div>
                </>
              )}
              <div className="result-msg">{result.message}</div>
              <button className="next-btn" onClick={() => setResult(null)}>Scan Next →</button>
            </div>
          )}
        </div>

        {recentList.length > 0 && (
          <div className="recent-card">
            <div className="recent-header">Recent Scans</div>
            {recentList.map((r, i) => (
              <div key={i} className="recent-item">
                <div className="recent-left">
                  <div className={`recent-icon ${r.success ? 'ok' : 'err'}`}>
                    {r.success ? '✅' : '❌'}
                  </div>
                  <div>
                    <div className="recent-name">{r.student?.name || 'Unknown'}</div>
                    {r.student?.rollNumber && (
                      <div className="recent-roll">{r.student.rollNumber}</div>
                    )}
                  </div>
                </div>
                <div className="recent-time">{r.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}