/**
 * 🔒 CENTRALNI API CONFIG - JEDINI IZVOR ISTINE
 * 
 * Svi API pozivi MORAJU koristiti API_BASE iz ovog fajla.
 * ZABRANJENO je hardkodiranje URL-ova bilo gde u kodu.
 * 
 * LOCKED TO: https://spa-dashboard-2.preview.emergentagent.com
 */

// ✅ JEDINI SOURCE-OF-TRUTH za backend URL
// Prioritet: .env varijabla -> hardcoded fallback
const envUrl = process.env.REACT_APP_BACKEND_URL || "";

// ✅ FIX: If .env points to frontend domain, use hardcoded backend
const ALLOWED_BACKENDS = [
  "spa-dashboard-2.preview.emergentagent.com",
  "massage-scheduler-4.preview.emergentagent.com",
];

const isEnvValid = ALLOWED_BACKENDS.some(h => envUrl.includes(h));

export const API_BASE = isEnvValid 
  ? envUrl 
  : "https://spa-dashboard-2.preview.emergentagent.com";

// ✅ DIJAGNOSTIKA: Uvek log API_BASE na load (za debug)
console.log("🔐 API_BASE =", API_BASE);
console.log("🔐 ORIGIN =", typeof window !== 'undefined' ? window.location.origin : 'SSR');
if (!isEnvValid && envUrl) {
  console.warn("⚠️ .env had invalid URL, using fallback:", envUrl, "->", API_BASE);
}

/**
 * ✅ FIX: "body stream already read" error
 * Čita body SAMO JEDNOM kao text, pa parsira JSON
 */
export async function safeJson(res) {
  const raw = await res.text(); // čita se samo jednom
  let data = null;

  try { 
    data = raw ? JSON.parse(raw) : null; 
  } catch { 
    data = { raw }; 
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || data?.detail || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/**
 * ✅ API Helper funkcije - koriste safeJson
 */
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  return safeJson(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return safeJson(res);
}

export async function apiPatch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
  });
  return safeJson(res);
}

// Export config
export const API_CONFIG = {
  // Base URL - koristi SAMO ovo
  BASE_URL: API_BASE,
  
  // Endpoint-i
  ENDPOINTS: {
    HEALTH: '/api/health',
    SERVICES: '/api/services',
    SERVICES_SINGLE: '/api/services/single/list',
    SERVICES_COUPLES: '/api/services/couples/list',
    APPOINTMENTS: '/api/appointments',
    APPOINTMENTS_COUPLE: '/api/appointments/couple',
    SPA_APPOINTMENTS: '/api/spa/appointments',
    SPA_SERVICES: '/api/spa/services',
    SPA_QUOTE: '/api/spa/quote',
  },
  
  // Helper funkcije
  getUrl: (endpoint) => `${API_BASE}${endpoint}`,
};

export default API_CONFIG;
