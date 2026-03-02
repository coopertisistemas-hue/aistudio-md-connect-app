# QA — Sprint 12-C: Attribution Tracking

**Date:** 2026-03-02  
**Sprint:** 12-C  
**Status:** ✅ Complete

---

## Overview

This sprint enhances attribution tracking to measure marketing campaign effectiveness and user acquisition sources.

---

## M0 — Scope

- Capture UTM parameters from URLs
- Track attribution events
- Include UTM data in all backend events

---

## M1 — Implementation

### UTM Parameters Already Supported

The analytics service already captures UTM parameters from URLs:
- `utm_source` - Traffic source (e.g., google, facebook)
- `utm_medium` - Marketing medium (e.g., cpc, email)
- `utm_campaign` - Campaign name
- `utm_term` - Search terms
- `utm_content` - Ad content variant

### New Attribution Events

| Event | Category | Trigger | Parameters |
|-------|----------|---------|------------|
| `attribution_captured` | Acquisition | First session with UTM params | `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` |
| `campaign_conversion` | Conversion | User converts from campaign | `utm_source`, `utm_campaign`, `conversion_type` |

### How It Works

1. **UTM Capture**: On first app load, checks URL for UTM parameters
2. **Session Storage**: Stores UTM params in sessionStorage for persistence
3. **Backend Events**: UTM params automatically included in all trackEvent calls
4. **Attribution Event**: Fires `attribution_captured` on first session with UTM params

### Files Modified

1. **`src/lib/event-taxonomy.ts`**
   - Added `attribution_captured` and `campaign_conversion` events

2. **`src/lib/analytics.ts`**
   - Added new event types to AnalyticsEventName

3. **`src/components/AnalyticsTracker.tsx`**
   - Added UTM capture logic on first session
   - Tracks `attribution_captured` event

### UTM Flow

```
User visits: https://app.mdconnect.com.br/?utm_source=facebook&utm_campaign=winter_event
    ↓
AnalyticsTracker captures UTM params
    ↓
sessionStorage stores: mdc_utm_captured = true
    ↓
All backend events include utm_source, utm_campaign
    ↓
Database stores attribution data with each event
```

---

## M2 — Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |

---

## Next Step (12-D)

- 12-D: Dashboard/visualization layer (Phase 5 completion)
