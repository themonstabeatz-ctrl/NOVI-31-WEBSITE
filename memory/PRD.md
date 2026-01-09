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

### 2025-01-09: "Uredi termin" Modal UI Enhancement
- ✅ Added Edit button (pencil icon) to appointment modal
- ✅ Usluga field shows service name + duration (e.g., "Romantični paket za parove - 210 min")
- ✅ Status dropdown is full-width and fully visible
- ✅ Edit form includes: Usluga (read-only), Klijent (read-only), Datum i vreme (read-only), Status (editable dropdown)
- ✅ Works for both MASAŽA and SPA appointments

### 2025-01-08: Romantic Cards Discount Display Fix
- ✅ Removed all hardcoded `25000` fallback values from Spa.js
- ✅ Romantic cards now use quote response data exclusively
- ✅ Booking message shows discount details when applicable

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
- `/app/frontend/src/pages/Termini.js` - Appointments view with edit modal
- `/app/frontend/src/pages/Spa.js` - SPA packages
- `/app/frontend/src/pages/Contact.js` - Booking form
