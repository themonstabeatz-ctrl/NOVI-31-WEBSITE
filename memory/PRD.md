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
- ❌ Do not hardcode prices

## Completed Features

### 2025-01-15: SPA Edit Modal - Service Dropdown Active
- ✅ SPA appointments now have ACTIVE dropdown for "Usluga" field
- ✅ Loaded 22 SPA services from `/api/spa/services`
- ✅ Dropdown shows service name + price (e.g., "Deep Renewal Ritual (11.600 RSD)")
- ✅ MASAŽE/PAROVI remain read-only (NOT touched)
- ⚠️ Backend limitation: PATCH not supported for SPA appointments (405)

### 2025-01-15: Regular Massage Pricing in Booking Message
- ✅ Massage.js sends pricing params (originalPrice, finalPrice, discountPercent)
- ✅ Contact.js displays pricing in "Poruka" field

### 2025-01-09: SPA "Usluga" Display Fix in Edit Modal
- ✅ Fixed `parseNotesSpa()` for multiple formats
- ✅ SPA Edit modal shows package name + duration

### 2025-01-09: "Uredi termin" Modal UI Enhancement
- ✅ Added Edit button (pencil icon)
- ✅ Status dropdown full-width

### 2025-01-08: Romantic Cards Discount Display Fix
- ✅ Removed hardcoded fallbacks from Spa.js

### 2025-01-08: API Hard-Lock Migration
- ✅ Migrated to `price-analyzer-8`

## Known Backend Limitations
- `/api/spa/appointments/{id}` does not support PATCH/PUT (returns 405)
- Only DELETE is allowed for SPA appointments

## Backlog

### P1 - Upcoming
- Email template customization (paused by user)

### P2 - Low Priority  
- Lazy loading images

### Future
- CEO Dashboard with analytics
- Mobile application

## Key Files
- `/app/frontend/src/config/api.js` - API configuration (CRITICAL)
- `/app/frontend/src/pages/Termini.js` - Edit modal with SPA service dropdown
- `/app/frontend/src/pages/Massage.js` - Massage bookings
- `/app/frontend/src/pages/Contact.js` - Booking form
- `/app/frontend/src/pages/Spa.js` - SPA packages
