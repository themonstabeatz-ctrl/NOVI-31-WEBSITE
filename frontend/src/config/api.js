/**
 * 🔒 CENTRALNI API CONFIG - OSIGURAČ
 * 
 * Svi API pozivi MORAJU koristiti ovaj config.
 * ZABRANJENO je hardkodiranje URL-ova bilo gde u kodu.
 * 
 * LOCKED TO: https://massage-scheduler-4.preview.emergentagent.com
 */

import { getBackendUrl } from './backendUrl';

// ✅ JEDINI SOURCE-OF-TRUTH za backend URL
export const API_BASE = getBackendUrl();

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
