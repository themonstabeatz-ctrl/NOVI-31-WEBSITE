# Bua Luang Thai Spa - PRD

## Original Problem Statement
Full-featured booking website for "Bua Luang" massage and spa business with multi-language support (Serbian, English, Russian, Thai).

## Core Architecture

### Frontend
- **URL**: https://spabook-upgrade.preview.emergentagent.com
- **Tech**: React
- **API Lock**: Hard-locked to `price-analyzer-8` backend

### Backend  
- **URL**: https://price-analyzer-8.preview.emergentagent.com
- **Status**: External backend (not managed in this repo)

## LATEST UPDATE (2025-01-15)

### ✅ API_BASE Consolidated - Single Source of Truth
**Completed:** Full API URL consolidation to ensure `spabook-upgrade` frontend uses ONLY `price-analyzer-8` backend.

**Changes:**
1. `/app/frontend/src/config/api.js` - Line 26: `API_BASE = "https://price-analyzer-8.preview.emergentagent.com"`
2. `/app/frontend/src/index.js` - Line 8: Runtime guard validates API_BASE
3. `/app/frontend/.env` - Updated REACT_APP_BACKEND_URL
4. Removed all references to old URLs (spabook-upgrade as API base, spa-booking-site-1, etc.)

**Proof (Console Logs):**
```
🔐 LOCKED FRONTEND = https://spabook-upgrade.preview.emergentagent.com
🔐 LOCKED API_BASE = https://price-analyzer-8.preview.emergentagent.com
✅ API_BASE verified = https://price-analyzer-8.preview.emergentagent.com
✅ Backend healthy
```

**Network Requests Verified:**
- GET /api/spa/cards → price-analyzer-8 ✅
- GET /api/spa/services → price-analyzer-8 ✅  
- POST /api/spa/quote → price-analyzer-8 ✅
- GET /api/appointments → price-analyzer-8 ✅
- GET /api/spa/appointments → price-analyzer-8 ✅

## VERIFIED WORKING (2025-01-15)

### SPA Edit Modal - FULLY FUNCTIONAL
**Screenshots and console logs confirm:**

1. **Dropdown is `<select>` and WORKS:**
   - Displays 22 SPA services with prices
   - Can click and select service
   - Gold styling (not gray, not disabled)

2. **Print opens after Save:**
   ```
   🖨️ PRINT_TRIGGERED_AFTER_SAVE {type: spa, id: aaa7f210-...}
   ```

3. **PUT returns 200 OK:**
   ```
   ✅ Appointment updated: {id: ..., type: spa}
   ```

4. **MASAŽE remain read-only (not touched)**

### Technical Implementation

**getType() detects SPA via:**
```javascript
if (row.type === "spa" || row.spa_category || row.category?.toLowerCase?.()?.includes("spa")) {
  return "spa";
}
```

**Data loading combines both endpoints:**
```javascript
const [massageData, spaData] = await Promise.all([
  fetch(`${API_BASE}/api/appointments`),
  fetch(`${API_BASE}/api/spa/appointments`)
]);
// SPA gets type: "spa" marker
const spaWithType = spaData.map(e => ({ ...e, type: "spa" }));
```

**Edit modal service field:**
```javascript
// SPA: Active <select> dropdown
getType(selectedEvent) === "spa" ? (
  <select style={{ color: "#d4af37", border: "2px solid #d4af37" }}>
    {spaServices.map(svc => <option>...</option>)}
  </select>
) : (
  // MASAŽE: Read-only <div>
  <div>{serviceDisplayLabel}</div>
)
```

**Save uses PUT with full payload:**
```javascript
const response = await fetch(`${API_BASE}/api/appointments/${id}`, {
  method: "PUT",
  body: JSON.stringify(fullPayload)
});
// After success:
console.log("🖨️ PRINT_TRIGGERED_AFTER_SAVE", { type, id });
printAppointment(mergedAppointment);
```

## Backlog

### P1 - Upcoming
- Email template customization (paused)

### P2 - Low Priority  
- Lazy loading images

### Future
- CEO Dashboard with analytics
- Mobile application

## Key Files
- `/app/frontend/src/pages/Termini.js` - Edit modal with SPA dropdown + print
- `/app/frontend/src/config/api.js` - API configuration (price-analyzer-8)
