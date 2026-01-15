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

### 2025-01-15: Regular Massage Pricing in Booking Message
- ✅ Added pricing params to Massage.js navigate (originalPrice, finalPrice, discountPercent, hasDiscount)
- ✅ Contact.js now displays pricing in "Poruka" field for regular massages
- ✅ WITH discount: Shows "Popust: -X%", "Originalna cena: X RSD", "Cena sa popustom: Y RSD"
- ✅ WITHOUT discount: Shows "Cena: X RSD"
- ✅ Multilingual labels (SR, EN, RU, TH)
- ✅ Couples/SPA booking NOT touched

### 2025-01-09: SPA "Usluga" Display Fix in Edit Modal
- ✅ Fixed `parseNotesSpa()` to support multiple notes formats
- ✅ SPA Edit modal now shows package name + duration

### 2025-01-09: "Uredi termin" Modal UI Enhancement
- ✅ Added Edit button (pencil icon)
- ✅ Status dropdown full-width and visible

### 2025-01-08: Romantic Cards Discount Display Fix
- ✅ Removed all hardcoded fallback values from Spa.js
- ✅ Romantic cards use quote response data exclusively

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
- `/app/frontend/src/pages/Massage.js` - Massage bookings with pricing params
- `/app/frontend/src/pages/Contact.js` - Booking form with pricing display
- `/app/frontend/src/pages/Termini.js` - Appointments view with edit modal
- `/app/frontend/src/pages/Spa.js` - SPA packages
