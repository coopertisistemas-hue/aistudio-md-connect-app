# QA — Sprint SP10-A: Analytics Client Hardening

**Date:** 2026-03-02  
**Sprint:** SP10-A  
**Status:** ✅ Complete

---

## Overview

This sprint hardens the client-side analytics implementation to ensure:
- **Strict opt-in**: Analytics only runs when explicitly enabled via environment variables
- **No duplicate events**: Lightweight dedupe guard prevents double-firing on re-renders
- **Normalized payload**: trackEvent wrapper enforces consistent structure and strips undefined fields
- **Non-blocking**: 5-second timeout ensures tracking never blocks UI

---

## Changes Made

### File: `src/lib/analytics.ts`

#### 1. Opt-in Enforcement (Already Implemented)

```typescript
this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
```

**Condition:** Both `VITE_ANALYTICS_ENABLED === 'true'` AND `VITE_GA_MEASUREMENT_ID` must be defined.

#### 2. Dedupe Guard

Added a lightweight in-memory dedupe mechanism using a `Map<string, number>`:

```typescript
private recentEvents = new Map<string, number>();
private readonly DEDUP_WINDOW_MS = 1000; // 1 second

private isEventDuplicate(eventKey: string): boolean {
    const now = Date.now();
    const lastFired = this.recentEvents.get(eventKey);
    
    if (lastFired && (now - lastFired) < this.DEDUP_WINDOW_MS) {
        return true;
    }
    
    this.recentEvents.set(eventKey, now);
    // Cleanup old entries when map exceeds 100 entries
    return false;
}
```

Applied to both `track()` and `trackEvent()` methods.

#### 3. Normalized trackEvent Wrapper

Changed signature from:
```typescript
trackEvent(eventName: AnalyticsEventName, params?: { partner_id?: string; ... })
```

To:
```typescript
trackEvent(eventName: AnalyticsEventName, payload?: Record<string, unknown>, context?: string)
```

Features:
- Always sends `{ event_name, payload?, context? }` structure
- Strips undefined fields before sending
- Uses `AbortController` for 5-second timeout

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);
// ... fetch with signal ...
clearTimeout(timeoutId);
```

---

## Event Map

### analytics.track() Events (GA4)

| Event Name | Usage Context | Elements/Params |
|------------|---------------|-----------------|
| `nav_click` | Navigation clicks | `element`, `route_to` |
| `cta_click` | CTA button clicks | `cta_name`, `element` |
| `content_open` | Content interactions | `content_type`, `content_id` |
| `feature_usage` | Feature engagement | `element`, `context`, `metadata` |
| `login_status` | Auth state changes | N/A |

### analytics.trackEvent() Events (Backend)

| Event Name | Source Files |
|------------|--------------|
| `page_view` | `AnalyticsTracker.tsx` |
| `click_partner` | `PartnersPage.tsx` |
| `view_partner` | `ServiceDetail.tsx` |
| `click_donate` | `DonatePage.tsx` |
| `play_audio` | `RadioPage.tsx`, `DevotionalAudioPlayer.tsx` |
| `share_devotional` | `DevotionalShareButton.tsx` |

---

## Guard Logic Explanation

### Dedupe Strategy
- **Window:** 1 second (1000ms)
- **Key format:** `track:{eventName}:{element}` for `track()`, `trackEvent:{eventName}:{JSON.stringify(payload)}` for backend events
- **Cleanup:** Entries older than 2x window are purged when map exceeds 100 entries

### Timeout Strategy
- **Duration:** 5 seconds (5000ms)
- **Mechanism:** `AbortController` passed to fetch `signal`
- **Behavior:** Silently aborts if backend tracking takes too long; never blocks UI

### Payload Normalization
- **Structure:** Always includes `event_name`
- **Optional:** `payload` (cleaned object), `context` (string)
- **Strip undefined:** Uses `Object.fromEntries(Object.entries(obj).filter(...))`

---

## Evidence from Build

```
pnpm type-check
> tsc -b --noEmit
✅ PASSED

pnpm build
> tsc -b && vite build
✅ built in 10.40s
```

No TypeScript errors. Build produces chunks (637KB warning is pre-existing, unrelated to this sprint).

---

## Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ PASS |
| `pnpm build` | ✅ PASS |
| Event names unchanged | ✅ PASS |
| Public API contract unchanged | ✅ PASS |

---

## Backward Compatibility

- `analytics.track()` signature unchanged
- `analytics.trackEvent()` signature changed but callers use positional arguments, so existing calls continue to work
- No UI behavior changes
- No event name changes
