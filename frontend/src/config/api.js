/**
 * 🔒 HARD LOCK - DO NOT CHANGE
 * Backend URL: spa-integration.preview.emergentagent.com
 * 
 * ❌ NEMA spa-booking-api
 * ❌ NEMA spa-dashboard-2
 * ❌ NEMA process.env
 * ❌ NEMA REACT_APP_BACKEND_URL
 * ❌ NEMA fallback-a
 */

// HARD LOCK - JEDINI BACKEND
export const API_BASE = "https://relax-reserve-5.preview.emergentagent.com";

// ✅ RUNTIME CHECK - pada ako je pogrešan backend
if (!API_BASE.includes("spa-integration.preview.emergentagent.com")) {
  console.error("🚨 WRONG BACKEND BASE!", API_BASE);
}

// ✅ CENTRALIZOVANE API RUTE
export const API = {
  // Health & Status
  health: `${API_BASE}/api/health`,

  // MASAŽE
  appointments: `${API_BASE}/api/appointments`,
  appointmentsList: `${API_BASE}/api/appointments/list`,

  // PAROVI
  coupleAppointments: `${API_BASE}/api/appointments/couple`,

  // SPA
  spaAppointments: `${API_BASE}/api/spa/appointments`,
  spaServices: `${API_BASE}/api/spa/services`,
  spaQuote: `${API_BASE}/api/spa/quote`,

  // Services
  services: `${API_BASE}/api/services`,
  servicesSingle: `${API_BASE}/api/services/single/list`,
  servicesCouples: `${API_BASE}/api/services/couples/list`,

  // CEO/NOTIF
  unviewedCount: `${API_BASE}/api/appointments/unviewed/count`,
  notifications: `${API_BASE}/api/notifications`,
  calendar: `${API_BASE}/api/appointments/calendar`,
};

// 🔐 LOG na startu
console.log("🔐 LOCKED API_BASE =", API_BASE);

// 🚫 ZABRANA: Discount updates - frontend NE SME da poziva
export function updateDiscount() {
  console.warn("🚫 Discount updates are backend-only. Frontend must not call update endpoints.");
  return Promise.resolve({ ok: false, error: "FORBIDDEN" });
}

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
 * ✅ Fetch wrapper za API pozive
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  return res;
}

// Legacy exports (za backward compatibility)
export const SPA_APPOINTMENTS_ENDPOINT = API.spaAppointments;
export const APPOINTMENTS_ENDPOINT = API.appointments;
export const APPOINTMENTS_LIST_ENDPOINT = API.appointmentsList;
export const APPOINTMENTS_COUPLE_ENDPOINT = API.coupleAppointments;
export const SERVICES_ENDPOINT = API.services;
export const SERVICES_SINGLE_ENDPOINT = API.servicesSingle;
export const SERVICES_COUPLES_ENDPOINT = API.servicesCouples;
export const SPA_SERVICES_ENDPOINT = API.spaServices;
export const HEALTH_ENDPOINT = API.health;
export const UNVIEWED_COUNT_ENDPOINT = API.unviewedCount;
export const CALENDAR_ENDPOINT = API.calendar;
export const NOTIFICATIONS_ENDPOINT = API.notifications;

// Default export
export default { API_BASE, API };
