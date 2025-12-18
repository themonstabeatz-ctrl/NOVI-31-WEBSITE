/**
 * 🔒 HARD LOCK: JEDINI IZVOR ISTINE ZA BACKEND URL
 * 
 * ZABRANJENO: čitanje iz .env ako je pogrešno ili prazno
 * ZABRANJENO: formiranje backend URL-a sa window.location, relative path ili fallback na frontend domen
 * 
 * LOCKED TO: https://spa-dashboard-2.preview.emergentagent.com
 */

// ✅ 1) JEDINI DOZVOLJENI BACKEND
export const BACKEND_URL = "https://spa-dashboard-2.preview.emergentagent.com";

// ✅ 2) WHITELIST dozvoljenih backend domena
export const ALLOWED_BACKENDS = new Set([
  "spa-dashboard-2.preview.emergentagent.com",
]);

// Helper: extract hostname from URL
function normalize(url) {
  try { return new URL(url).hostname; } catch { return ""; }
}

// ✅ 3) Opciona .env podrška - ALI SAMO ako je u ALLOWED_BACKENDS
const envUrl = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_BASE) 
  || process.env.REACT_APP_BACKEND_URL 
  || process.env.REACT_APP_API_BASE 
  || "";
const envHost = normalize(envUrl.trim());

// API_BASE = .env vrednost samo ako je host dozvoljen, inače BACKEND_URL
export const API_BASE = (envHost && ALLOWED_BACKENDS.has(envHost))
  ? envUrl.trim().replace(/\/$/, "")
  : BACKEND_URL;

// ✅ 4) HARD GUARD: fail fast ako neko pokuša da koristi nedozvoljen backend
(function guard() {
  const host = (() => { try { return new URL(API_BASE).hostname; } catch { return ""; } })();
  if (!ALLOWED_BACKENDS.has(host)) {
    console.error("🚨 FATAL: Invalid API_BASE:", API_BASE);
    console.error("🚨 ALLOWED_BACKENDS:", [...ALLOWED_BACKENDS]);
    throw new Error("FATAL: API_BASE is not allowed. Backend HARD LOCKED to spa-dashboard-2.");
  }
})();

// ✅ 5) LOG na startu za dijagnostiku
console.log("🔐 LOCKED API_BASE =", API_BASE);

/**
 * ✅ apiFetch - centralizovan fetch wrapper
 * Svi API pozivi MORAJU koristiti ovu funkciju.
 */
export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return res;
}

/**
 * ✅ safeJson - FIX za "body stream already read" error
 * Čita body SAMO JEDNOM kao text, pa parsira JSON
 */
export async function safeJson(res) {
  const raw = await res.text();
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
 * ✅ API Helper funkcije - koriste apiFetch + safeJson
 */
export async function apiGet(path) {
  const res = await apiFetch(path);
  return safeJson(res);
}

export async function apiPost(path, body) {
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return safeJson(res);
}

export async function apiPatch(path, body = null) {
  const res = await apiFetch(path, {
    method: "PATCH",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return safeJson(res);
}

// ✅ Export config object za kompatibilnost
export const API_CONFIG = {
  BASE_URL: API_BASE,
  
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
  
  getUrl: (endpoint) => `${API_BASE}${endpoint}`,
};

export default API_CONFIG;
