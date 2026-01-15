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
- Protection: `Object.freeze()` + Runtime guard in `index.js`

### Forbidden Actions
- ❌ Do not change API_BASE
- ❌ Do not use process.env for backend URL
- ❌ Do not add client-side price calculations
- ❌ Do not modify discount endpoints from client
- ❌ Do not hardcode prices (must come from backend)

## Completed Features

### 2025-01-09: SPA "Usluga" Display Fix in Edit Modal
- ✅ Fixed `parseNotesSpa()` to support multiple notes formats (SPA paket:, Paket:, emoji prefix)
- ✅ Fixed `getTitle()` to prefer notes-parsed title for SPA when backend returns generic "SPA Tretman"
- ✅ SPA Edit modal now shows: "Romantični piling paket za parove - 210 min"
- ✅ MASAŽE and PAROVI logic NOT touched

### 2025-01-09: "Uredi termin" Modal UI Enhancement
- ✅ Added Edit button (pencil icon) to appointment modal
- ✅ Usluga field shows service name + duration
- ✅ Status dropdown is full-width and fully visible
- ✅ Works for both MASAŽA and SPA appointments

### 2025-01-08: Romantic Cards Discount Display Fix
- ✅ Removed all hardcoded `25000` fallback values from Spa.js
- ✅ Romantic cards now use quote response data exclusively

### 2025-01-08: API Hard-Lock Migration
- ✅ Migrated API_BASE to `price-analyzer-8`
- ✅ Added Object.freeze() + runtime guard

### Previous Sessions
- ✅ Full localization (SR, EN, RU, TH)
- ✅ SPA booking with discount display
- ✅ Massage page with duration selection
- ✅ Couples massage with localized dropdowns
- ✅ Contact form with detailed booking messages
- ✅ Termini (Appointments) admin view

## Key Technical Details

### SPA Title Parsing (Termini.js)
```javascript
// parseNotesSpa supports:
// Format 1: "SPA paket: Silky Body Ritual"
// Format 2: "Paket: Romantični paket za parove"
// Format 3: "🌹 Romantični SPA paket za parove" (first line with emoji)

// getTitle for SPA prefers notes-parsed title when backend returns generic name
```

## Backlog

### P1 - Upcoming
- Email template customization (paused by user)

### P2 - Low Priority  
- Lazy loading images in Spa.js, Massage.js, Gallery.js

### Future
- CEO Dashboard with analytics
- Mobile application consideration

## Key Files
- `/app/frontend/src/config/api.js` - API configuration (CRITICAL)
- `/app/frontend/src/index.js` - Runtime guard
- `/app/frontend/src/pages/Termini.js` - Appointments view with edit modal + SPA title parsing
- `/app/frontend/src/pages/Spa.js` - SPA packages
- `/app/frontend/src/pages/Contact.js` - Booking form
