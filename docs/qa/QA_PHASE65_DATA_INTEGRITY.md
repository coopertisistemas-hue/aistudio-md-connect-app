# QA — Phase 6.5: Data Integrity Audit

**Date:** 2026-03-02  
**Phase:** 6.5  
**Status:** ✅ Complete

---

## Overview

This phase performs a data integrity audit to validate that all analytics events are properly registered and used consistently across the codebase.

---

## M0 — Scope

- Validate all trackEvent calls use registered event names
- Validate all track() (GA4) calls use valid event names
- Ensure no orphaned or unregistered events

---

## M1 — Implementation

### Audit Script Created

**File:** `scripts/audit-analytics-events.mjs`

The script:
1. Scans all `.tsx` files in `src/`
2. Extracts all `analytics.trackEvent()` calls
3. Extracts all `analytics.track()` calls
4. Validates each against registered event lists
5. Reports any invalid events

### Run the Audit

```bash
node scripts/audit-analytics-events.mjs
```

---

## M2 — Audit Results

```
🔍 MD Connect - Analytics Data Integrity Audit

📊 Found 23 trackEvent calls
📊 Found 20 track() calls

--- trackEvent Validation ---
✅ All trackEvent calls use valid registered events

--- track() Validation ---
✅ All track() calls use valid GA4 events

==================================================
📋 SUMMARY
==================================================
Backend Events Registered: 21
GA4 Events Registered: 5
trackEvent calls found: 23
track() calls found: 20
Invalid trackEvent: 0
Invalid track(): 0

✅ DATA INTEGRITY: PASSED
```

---

## M3 — Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |
| Data Integrity Audit | ✅ Pass |

---

## Event Registry Summary

| Type | Registered | Used | Valid |
|------|------------|------|-------|
| Backend Events | 21 | 23 | ✅ |
| GA4 Events | 5 | 20 | ✅ |

---

## Files Analyzed

- `src/components/analytics/AnalyticsTracker.tsx`
- `src/components/auth/ChurchScopedRoute.tsx`
- `src/components/monetization/AffiliateCard.tsx`
- `src/components/monetization/DonateBlock.tsx`
- `src/components/monetization/SponsorOfTheDay.tsx`
- `src/components/home/ChurchPartnersBlock.tsx`
- `src/components/home/DonationWidget.tsx`
- `src/components/home/MuralCompact.tsx`
- `src/components/home/VerseCard.tsx`
- `src/components/ui/QuickActions.tsx`
- `src/components/layout/AppFooter.tsx`
- `src/components/Devotional/DevotionalAudioPlayer.tsx`
- `src/components/Devotional/DevotionalShareButton.tsx`
- `src/pages/Login.tsx`
- `src/pages/onboarding/SelectChurch.tsx`
- `src/pages/public/DonatePage.tsx`
- `src/pages/public/PartnersPage.tsx`
- `src/pages/public/RadioPage.tsx`
- `src/pages/public/PartnerLeadPage.tsx`
- `src/pages/Monetization/ServiceDetail.tsx`
- `src/pages/features/VersePosterPage.tsx`

---

## Conclusion

✅ **Data Integrity: PASSED**

All analytics events are properly registered and used consistently. No orphaned or invalid events found.
