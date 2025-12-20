/**
 * 🔒 HARD LOCK - DO NOT CHANGE
 * Backend URL: spa-integration.preview.emergentagent.com
 * Frontend URL: relax-reserve-5.preview.emergentagent.com
 * 
 * ❌ ZERO spa-booking-api
 * ❌ ZERO spa-dashboard-2
 * ❌ ZERO massage-app-4
 * ❌ ZERO process.env
 * ❌ ZERO REACT_APP_BACKEND_URL
 * ❌ ZERO fallback
 * ❌ ZERO window.location
 */

export const API_BASE = "https://spa-integration.preview.emergentagent.com";

export const API = {
  health: `${API_BASE}/api/health`,

  // MASAŽE
  appointments: `${API_BASE}/api/appointments`,
  appointmentsList: `${API_BASE}/api/appointments/list`,

  // PAROVI
  coupleAppointments: `${API_BASE}/api/appointments/couple`,

  // SPA
  spaAppointments: `${API_BASE}/api/spa/appointments`,

  // CEO / NOTIF
  unviewedCount: `${API_BASE}/api/appointments/unviewed/count`,
};
