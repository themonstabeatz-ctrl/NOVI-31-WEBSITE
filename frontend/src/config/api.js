/**
 * 🔒 HARD LOCK - DO NOT CHANGE
 * Backend URL: spa-booking-api.preview.emergentagent.com
 * 
 * ❌ NEMA spa-dashboard-2
 * ❌ NEMA env koji može da promeni agent
 * ❌ NEMA fallback-a
 */

// HARD LOCK - JEDINI BACKEND
export const API_BASE = "https://spa-booking-api.preview.emergentagent.com";

// ✅ Endpoint helpers
export const SPA_APPOINTMENTS_ENDPOINT = `${API_BASE}/api/spa/appointments`;
export const APPOINTMENTS_ENDPOINT = `${API_BASE}/api/appointments`;
export const APPOINTMENTS_LIST_ENDPOINT = `${API_BASE}/api/appointments/list`;
export const APPOINTMENTS_COUPLE_ENDPOINT = `${API_BASE}/api/appointments/couple`;
export const NOTIFICATIONS_ENDPOINT = `${API_BASE}/api/notifications`;
export const SERVICES_ENDPOINT = `${API_BASE}/api/services`;
export const SERVICES_SINGLE_ENDPOINT = `${API_BASE}/api/services/single/list`;
export const SERVICES_COUPLES_ENDPOINT = `${API_BASE}/api/services/couples/list`;
export const SPA_SERVICES_ENDPOINT = `${API_BASE}/api/spa/services`;
export const HEALTH_ENDPOINT = `${API_BASE}/api/health`;

// ✅ Admin dashboard endpoints
export const UNVIEWED_COUNT_ENDPOINT = `${API_BASE}/api/appointments/unviewed/count`;
export const CALENDAR_ENDPOINT = `${API_BASE}/api/appointments/calendar`;

// 🔐 LOG na startu
console.log("🔐 LOCKED API_BASE =", API_BASE);

/**
 * ✅ Safe JSON helper - čita body SAMO JEDNOM
 */
export async function safeJson(res) {
  const text = await res.text();
  let data = null;
  
  try { 
    data = text ? JSON.parse(text) : null; 
  } catch { 
    data = { raw: text }; 
  }
  
  if (!res.ok) {
    const msg = data?.error || data?.message || data?.detail || `HTTP_${res.status}`;
    throw new Error(msg);
  }
  
  return data;
}

/**
 * ✅ Fetch wrapper
 */
export async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

// Default export
export default { API_BASE };
