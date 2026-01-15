# Bua Luang Thai Spa - PRD

## Original Problem Statement
Full-featured booking website for "Bua Luang" massage and spa business with multi-language support (Serbian, English, Russian, Thai).

## Core Architecture

### Frontend
- **URL**: https://spa-booking-site-1.preview.emergentagent.com
- **Tech**: React
- **API Lock**: Hard-locked to `price-analyzer-8` backend

### Backend  
- **URL**: https://price-analyzer-8.preview.emergentagent.com
- **Status**: External backend (not managed in this repo)

## Critical Configuration

### API_BASE (Single Source of Truth)
- File: `/app/frontend/src/config/api.js`
- Value: `https://price-analyzer-8.preview.emergentagent.com`
- Protection: `Object.freeze()` + Runtime guard

## Completed Features

### 2025-01-15: SPA Edit Modal - FULLY WORKING
- ✅ Fixed `getType()` to properly detect SPA appointments via `spa_category` field
- ✅ SPA dropdown is INTERACTIVE (not disabled) - gold styling, working click
- ✅ Changed from PATCH to PUT method (backend requirement)
- ✅ PUT sends complete payload: client info, service_id, start_time, status, notes
- ✅ Print window opens after successful save: `PRINT_TRIGGERED_AFTER_SAVE {type: spa}`
- ✅ Backend returns 200 OK (not 405)
- ✅ MASAŽE/PAROVI remain read-only div (NOT touched)

### Previous Fixes
- SPA dropdown active styling (gold text, 2px border, glow)
- Print function with styled HTML template
- Regular massage pricing in booking message
- SPA "Usluga" display fix in edit modal
- "Uredi termin" modal UI enhancement
- Romantic cards discount display fix
- API hard-lock migration to price-analyzer-8

## Key Technical Details

### getType() Function
```javascript
function getType(row) {
  // Detect SPA via type or spa_category
  if (row.type === "spa" || row.spa_category || row.category?.toLowerCase?.()?.includes("spa")) {
    return "spa";
  }
  // ... couples and massage detection
}
```

### Edit Modal Service Field
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

### Save Handler
- Uses PUT method (not PATCH)
- Sends complete appointment object
- Triggers print after success: `PRINT_TRIGGERED_AFTER_SAVE`

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
- `/app/frontend/src/config/api.js` - API configuration
- `/app/frontend/src/pages/Massage.js` - Massage bookings
- `/app/frontend/src/pages/Contact.js` - Booking form
- `/app/frontend/src/pages/Spa.js` - SPA packages
