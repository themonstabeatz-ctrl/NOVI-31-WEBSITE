/**
 * 🔒 HARD LOCK - DO NOT CHANGE
 * Backend URL: price-consistency.preview.emergentagent.com
 * Frontend URL: relax-reserve-5.preview.emergentagent.com
 * 
 * ❌ ZERO spa-web-update (OLD)
 * ❌ ZERO spa-integration (OLD)
 * ❌ ZERO spa-booking-api
 * ❌ ZERO spa-dashboard-2
 * ❌ ZERO massage-app-4
 * ❌ ZERO process.env
 * ❌ ZERO REACT_APP_BACKEND_URL
 * ❌ ZERO fallback
 * ❌ ZERO window.location
 * 
 * 🚫 DISCOUNT UPDATES ARE RECEPCIJA-ONLY!
 * Client frontend ONLY READS discount data from backend.
 * Client NEVER calls PATCH discount endpoints.
 */

export const API_BASE = "https://price-consistency.preview.emergentagent.com";

// Debug log on import
console.log("✅ API_BASE =", API_BASE);

export const API = {
  health: `${API_BASE}/api/health`,

  // MASAŽE
  appointments: `${API_BASE}/api/appointments`,
  appointmentsList: `${API_BASE}/api/appointments/list`,

  // PAROVI
  coupleAppointments: `${API_BASE}/api/appointments/couple`,

  // SPA
  spaAppointments: `${API_BASE}/api/spa/appointments`,
  spaCards: `${API_BASE}/api/spa/cards`,
  spaQuote: `${API_BASE}/api/spa/quote`,
  spaServices: `${API_BASE}/api/spa/services`,

  // CEO / NOTIF
  unviewedCount: `${API_BASE}/api/appointments/unviewed/count`,
};

/**
 * 🚫 GUARD: Discount updates are RECEPCIJA-ONLY
 * This function exists to prevent ANY discount update from client UI.
 * If any code tries to call this, it will be blocked with a warning.
 */
export function updateDiscount() {
  console.warn("🚫 Discount updates are RECEPCIJA-only. Client cannot modify discounts.");
  return Promise.resolve({ ok: false, error: "FORBIDDEN" });
}

/**
 * 🚫 GUARD: Block any PATCH to discount endpoints
 * This is a safety net - client code should NEVER reach here.
 */
export function patchDiscount() {
  console.warn("🚫 PATCH /discount is BLOCKED. Use recepcija to update discounts.");
  return Promise.resolve({ ok: false, error: "FORBIDDEN" });
}
