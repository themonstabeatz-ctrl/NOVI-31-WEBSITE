# Bua Luang Thai Spa - Product Requirements Document

## Original Problem Statement
Multi-language SPA booking application for Thai Spa with frontend synchronized to a specific backend API.

## Current Status: FRONTEND FROZEN 🔒
- **Frontend URL**: https://multi-lang-spa-1.preview.emergentagent.com/
- **Backend API**: https://multilingfix.preview.emergentagent.com/
- **Last Updated**: January 2025

## Completed Features ✅

### API Synchronization (January 2025)
- API_BASE locked to `multilingfix` backend
- All old domain references removed
- Runtime guard in index.js prevents misconfiguration
- Console logging confirms locked configuration

### Multi-language Support
- Languages: Serbian (SR), English (EN), Russian (RU), Thai (TH)
- URL-driven language control via `?lang=` parameter
- Full SPA page UI translation
- 50+ translation keys in translations.js

### Scroll Management
- ScrollManager.js component for reliable scroll-to-top
- Navigation to `/spa#top` forces scroll position to (0,0)

### Booking System
- Contact.js sends `lang` parameter in all booking payloads
- Supports appointments, spa appointments, couple appointments

## Architecture

```
/app/frontend/src/
├── config/api.js         # CRITICAL: API_BASE locked to multilingfix
├── index.js              # Runtime guard for API_BASE
├── components/
│   ├── ScrollManager.js  # Scroll-to-top handling
│   └── BackendHealthCheck.js
├── context/
│   └── LanguageContext.js # URL param language control
├── data/
│   └── translations.js   # All UI translations
└── pages/
    ├── Spa.js            # Main SPA page (fully translated)
    ├── Contact.js        # Booking with lang parameter
    └── Termini.js        # Appointments display
```

## API Endpoints (multilingfix backend)
- `GET /api/health`
- `GET /api/spa/services`
- `GET /api/spa/cards`
- `POST /api/appointments`
- `POST /api/spa/appointments`
- `POST /api/appointments/couple`

## Known Limitations
- Backend-driven content (service names) remains untranslated on frontend
- Admin UI bugs are out of scope (separate codebase)

## Backlog

### P1 - High Priority
- Email template customization (BACKEND TASK)

### P2 - Medium Priority
- Lazy loading images for Spa.js, Massage.js, Gallery.js

### P3 - Future
- CEO Dashboard with analytics
- Backend content translation
- Mobile application
