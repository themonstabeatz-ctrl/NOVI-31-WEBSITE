import React, { useState, useEffect } from 'react';
import { API_BASE, safeJson } from '../config/api';

/**
 * 🔒 OSIGURAČ: Backend Health Check Component
 * 
 * Na load proverava /api/health endpoint.
 * Ako backend nije dostupan, prikazuje jasnu poruku umesto da se app raspadne.
 * 
 * LOCKED TO: https://massage-scheduler-4.preview.emergentagent.com
 */
const BackendHealthCheck = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'healthy', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState({ statusCode: null, responseText: null });
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const checkBackendHealth = async (attempt = 1) => {
      const BACKEND_URL = API_BASE;
      
      // 🔍 DIJAGNOSTIKA: Log ORIGIN i API_BASE
      console.log("🔍 [BackendHealthCheck] ORIGIN:", window.location.origin);
      console.log("🔍 [BackendHealthCheck] API_BASE:", BACKEND_URL);
      
      // 🔒 OSIGURAČ: Provera da je URL ispravan
      if (!BACKEND_URL) {
        setStatus('error');
        setErrorMessage('Backend URL nije dostupan');
        return;
      }

      try {
        console.log(`🔍 Checking backend health (attempt ${attempt}/${MAX_RETRIES}):`, BACKEND_URL);
        // Koristi /api/services umesto /api/health jer eksterni backend nema health endpoint
        const response = await fetch(`${BACKEND_URL}/api/services`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });

        // ✅ FIX: Use safeJson to avoid "body stream already read"
        const data = await safeJson(response);
        console.log('✅ Backend healthy:', data);
        setStatus('healthy');
      } catch (error) {
        console.error(`❌ Backend health check failed (attempt ${attempt}):`, error);
        
        // Retry logic
        if (attempt < MAX_RETRIES) {
          console.log(`🔄 Retry in 2 seconds... (${attempt}/${MAX_RETRIES})`);
          setTimeout(() => checkBackendHealth(attempt + 1), 2000);
          return;
        }
        
        // All retries failed
        setStatus('error');
        // Detaljnija poruka greške
        if (error.message === 'Failed to fetch') {
          setErrorMessage('Backend unreachable or CORS blocked');
          setErrorDetails(prev => ({ ...prev, statusCode: 'CORS/Network', responseText: 'Failed to fetch - possible CORS or network issue' }));
        } else {
          setErrorMessage(error.message || 'Nije moguće povezati se sa serverom');
          setErrorDetails(prev => ({ ...prev, responseText: error.message }));
        }
      }
    };

    checkBackendHealth();
  }, [retryCount]);

  // Dok se proverava
  if (status === 'checking') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#d4af37',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
          <p>Povezivanje sa serverom...</p>
        </div>
      </div>
    );
  }

  // Ako je greška
  if (status === 'error') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '500px',
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          border: '2px solid #dc2626'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>Backend unreachable or CORS blocked</h1>
          <p style={{ color: '#999', marginBottom: '1rem' }}>
            Nije moguće povezati se sa serverom za rezervacije.
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Greška: {errorMessage}
          </p>
          {errorDetails.statusCode && (
            <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Status: {errorDetails.statusCode}
            </p>
          )}
          {errorDetails.responseText && (
            <p style={{ color: '#666', fontSize: '0.75rem', marginBottom: '1rem', wordBreak: 'break-word' }}>
              Response: {errorDetails.responseText.substring(0, 200)}
            </p>
          )}
          <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '1rem' }}>
            API_BASE: {API_BASE}
          </p>
          <button
            onClick={() => setRetryCount(prev => prev + 1)}
            style={{
              backgroundColor: '#d4af37',
              color: '#1a1a1a',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Pokušaj ponovo
          </button>
          <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1rem' }}>
            Ako problem potraje, kontaktirajte nas na telefon.
          </p>
        </div>
      </div>
    );
  }

  // Ako je sve OK, prikaži children
  return <>{children}</>;
};

export default BackendHealthCheck;
