/**
 * 🔒 CENTRALNI API CONFIG - JEDINI IZVOR ISTINE
 * 
 * Svi API pozivi MORAJU koristiti API_BASE iz ovog fajla.
 * ZABRANJENO je hardkodiranje URL-ova bilo gde u kodu.
 * 
 * LOCKED TO: https://massage-scheduler-4.preview.emergentagent.com
 */

// ✅ JEDINI SOURCE-OF-TRUTH za backend URL
// Prioritet: .env varijabla -> hardcoded fallback
export const API_BASE = 
  process.env.REACT_APP_BACKEND_URL ||
  "https://massage-scheduler-4.preview.emergentagent.com";

// 🔴 HARD FAIL: Provera da URL pokazuje na pravi backend
if (API_BASE.includes("massage-hub-") || API_BASE.includes("relaxhub-")) {
  console.error("🔴 FATAL: API_BASE points to FRONTEND domain:", API_BASE);
  throw new Error("FATAL API CONFIG: API_BASE points to frontend domain, not backend!");
}

// ✅ DIJAGNOSTIKA: Log na load
console.log("✅ API_BASE (source of truth):", API_BASE);

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
  },
  
  // Helper funkcije
  getUrl: (endpoint) => `${API_BASE}${endpoint}`,
};

export default API_CONFIG;
