/**
 * 🔒 DEPRECATED - Koristi API_BASE iz api.js umesto ovoga!
 * 
 * Ovaj fajl postoji samo za backward compatibility.
 * Svi novi pozivi treba da koriste:
 *   import { API_BASE } from '../config/api';
 */

import { API_BASE } from './api';

// ✅ DEPRECATED: Koristi API_BASE direktno
export function getBackendUrl() {
  console.warn("⚠️ DEPRECATED: getBackendUrl() - koristi API_BASE iz api.js");
  return API_BASE;
}

export default getBackendUrl;
