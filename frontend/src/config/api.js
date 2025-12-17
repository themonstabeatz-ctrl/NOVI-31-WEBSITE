/**
 * 🔒 CENTRALNI API CONFIG - OSIGURAČ
 * 
 * Svi API pozivi MORAJU koristiti ovaj config.
 * ZABRANJENO je hardkodiranje URL-ova bilo gde u kodu.
 * 
 * LOCKED TO: https://massage-scheduler-4.preview.emergentagent.com
 */

import { getBackendUrl } from './backendUrl';

// Jedini izvor istine za backend URL - GUARDED
const BACKEND_URL = getBackendUrl();

// Export config
export const API_CONFIG = {
  // Base URL - koristi SAMO ovo
  BASE_URL: BACKEND_URL,
  
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
  getUrl: (endpoint) => `${BACKEND_URL}${endpoint}`,
  
  // Provera validnosti
  isValid: () => BACKEND_URL && BACKEND_URL.includes(EXPECTED_BACKEND),
  
  // Debug info
  debug: () => ({
    backendUrl: BACKEND_URL,
    expected: EXPECTED_BACKEND,
    isValid: BACKEND_URL && BACKEND_URL.includes(EXPECTED_BACKEND),
  }),
};

// Log na load za debugging
console.log('🔒 API Config loaded:', API_CONFIG.debug());

export default API_CONFIG;
