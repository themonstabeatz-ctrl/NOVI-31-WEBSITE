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

### 2025-01-15: SPA Edit Modal - Active Dropdown + Print
- ✅ SPA dropdown now has ACTIVE styling (gold text, 2px gold border, glow effect)
- ✅ No gray/disabled appearance for SPA service dropdown
- ✅ Print dialog opens after Save (same as massage)
- ✅ Print includes: service name, duration, client info, pricing
- ✅ MASAŽE/PAROVI remain read-only div (NOT touched)

### 2025-01-15: SPA Edit Modal - Service Dropdown Active
- ✅ SPA appointments have active dropdown for "Usluga" field
- ✅ Loaded 22 SPA services from `/api/spa/services`

### 2025-01-15: Regular Massage Pricing in Booking Message
- ✅ Massage.js sends pricing params
- ✅ Contact.js displays pricing in "Poruka" field

### Previous Sessions
- ✅ SPA "Usluga" display fix in edit modal
- ✅ "Uredi termin" modal UI enhancement
- ✅ Romantic cards discount display fix
- ✅ API hard-lock migration
- ✅ Full localization (SR, EN, RU, TH)
- ✅ SPA/Massage booking flows
- ✅ Couples massage with localized dropdowns
- ✅ Termini (Appointments) admin view

## Key Technical Details

### Edit Modal Service Field Logic
```javascript
// SPA: Active dropdown with gold styling
getType(selectedEvent) === "spa" ? (
  <select style={{ color: "#d4af37", border: "2px solid #d4af37", ... }}>
    {spaServices.map(svc => <option>...</option>)}
  </select>
) : (
  // MASAŽE/PAROVI: Read-only div (NOT touched)
  <div style={{ opacity readonly styling }}>
    {serviceDisplayLabel}
  </div>
)
```

### Print Function
- Opens new window with styled HTML
- Includes: badge (SPA/MASAŽA), service, duration, client, pricing
- Works for both SPA and massage appointments
- Triggered after successful save or on 405 error (backend limitation)

## Known Backend Limitations
- `/api/spa/appointments/{id}` does not support PATCH/PUT (returns 405)
- Print still works despite save limitation

## Backlog

### P1 - Upcoming
- Email template customization (paused)

### P2 - Low Priority  
- Lazy loading images

### Future
- CEO Dashboard with analytics
- Mobile application

## Key Files
- `/app/frontend/src/pages/Termini.js` - Edit modal with SPA service dropdown + print function
- `/app/frontend/src/config/api.js` - API configuration
- `/app/frontend/src/pages/Massage.js` - Massage bookings
- `/app/frontend/src/pages/Contact.js` - Booking form
- `/app/frontend/src/pages/Spa.js` - SPA packages
