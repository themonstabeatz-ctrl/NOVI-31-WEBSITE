# Bua Luang Thai Spa - Product Requirements Document

## Original Problem Statement
Multi-language SPA booking application for Thai Spa with frontend synchronized to a specific backend API.

## Current Status: TRANSLATION COMPLETE 🌍
- **Frontend URL**: https://spa-parallax-page.preview.emergentagent.com/
- **Backend API**: https://spa-parallax-page.preview.emergentagent.com/
- **Last Updated**: January 2025

## Completed Features ✅

### API Synchronization (January 2025)
- API_BASE locked to `multilingfix` backend
- All old domain references removed
- Runtime guard in index.js prevents misconfiguration

### Full Multi-language Support (January 2025)
- **Languages**: Serbian (SR), English (EN), Russian (RU), Thai (TH)
- **URL-driven control**: `?lang=` parameter
- **Translated elements**:
  - Hero section titles and subtitles
  - All SPA package names and descriptions
  - Package "included" items with duration
  - Variant options (with/without face massage)
  - SPA zone labels (Sauna, Steam Bath, Jacuzzi)
  - Booking buttons
  - Romantic couple package content
  - Bachelorette party content
  - Lady Party call button (phone number hidden, tel: link in background)
- **Helper functions**:
  - `translateIncludedItem()` - translates package included items
  - `translateZoneLabel()` - translates SPA zone names
  - `translatePackageDescription()` - translates package descriptions
  - `translateVariantLabel()` - translates variant options

### UI Improvements (January 2025)
- **Gallery FADE OUT**: Hero text and subtitle fade out on scroll
- **About FADE OUT**: Hero text and subtitle fade out on scroll
- **Lady Party Button**: Phone number removed from text, tel: link preserved for mobile calls

### Scroll Management
- ScrollManager.js component for reliable scroll-to-top
- Navigation to `/spa#top` forces scroll to (0,0)

### Booking System
- Contact.js sends `lang` parameter in all booking payloads
- Supports appointments, spa appointments, couple appointments

## Architecture

```
/app/frontend/src/
├── config/api.js         # API_BASE locked to multilingfix
├── index.js              # Runtime guard
├── components/
│   ├── ScrollManager.js
│   └── BackendHealthCheck.js
├── context/
│   └── LanguageContext.js # URL param language control
├── data/
│   └── translations.js   # 50+ translation keys per language
└── pages/
    ├── Spa.js            # Fully translated with helper functions
    ├── Contact.js
    └── Termini.js
```

## Translation Keys Added
- `spaBodyScrub30/60` - Body scrub with duration
- `spaBodyWrap60` - Body wrap
- `spaAromaMassage60/90` - Aroma massage
- `spaAromaHerbal90` - Aroma with herbal compresses
- `spaThaiHerbal90` - Thai with herbal compresses
- `spaAromaStone90` - Aromatherapy & hot stones
- `spaFaceMassage60` - Face massage
- `spaSauna30`, `spaSteamBath30`, `spaJacuzzi30` - Zone durations
- `spaSilkyHerbalDesc`, `spaThaiHerbalCompressDesc`, `spaAromaStoneDesc` - Herbal descriptions

## API Endpoints
- `GET /api/health`
- `GET /api/spa/services`
- `GET /api/spa/cards`
- `POST /api/appointments`
- `POST /api/spa/appointments`
- `POST /api/appointments/couple`

## Known Limitations
- Backend-driven content (service names from API) not translated on frontend
- Admin UI bugs out of scope (separate codebase)

## Backlog

### P1 - High Priority
- Email template customization (BACKEND TASK)

### P2 - Medium Priority
- Lazy loading images for Spa.js, Massage.js, Gallery.js

### P3 - Future
- CEO Dashboard with analytics
- Backend content translation
- Mobile application
