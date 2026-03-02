# QA — Sprint 12-B: Growth Analytics Instrumentation

**Date:** 2026-03-02  
**Sprint:** 12-B  
**Status:** ✅ Complete

---

## Overview

This sprint instruments key growth events across the user journey to track acquisition, onboarding, and retention.

---

## M0 — Scope

- Instrument onboarding flow events
- Track user sessions and return visits
- Measure first-time vs returning users

---

## M1 — Implementation

### New Growth Events Added

| Event | Category | Trigger | Parameters |
|-------|----------|---------|------------|
| `onboarding_start` | Acquisition | User loads SelectChurch page | - |
| `church_selected` | Acquisition | User selects church | `church_id`, `church_slug` |
| `onboarding_complete` | Acquisition | User enters church (first time) | `church_id` |
| `first_login` | Acquisition | User logs in (first time) | - |
| `return_visit` | Retention | Returning user session | `session_count` |
| `app_session` | Engagement | App session start | `session_count` |

### Files Modified

1. **`src/lib/event-taxonomy.ts`**
   - Added 6 new growth events to BACKEND_EVENTS

2. **`src/lib/analytics.ts`**
   - Added new event types to AnalyticsEventName

3. **`src/pages/onboarding/SelectChurch.tsx`**
   - Track `onboarding_start` on page mount
   - Track `church_selected` on church selection

4. **`src/pages/Login.tsx`**
   - Track `first_login` (detected via localStorage flag)

5. **`src/components/AnalyticsTracker.tsx`**
   - Track `app_session` / `return_visit` on app mount
   - Session counting via sessionStorage

6. **`src/components/auth/ChurchScopedRoute.tsx`**
   - Track `onboarding_complete` when user first enters church

### Detection Logic

- **First login**: `localStorage.getItem('mdc_first_login_done')`
- **Onboarding complete**: `localStorage.getItem('mdc_onboarding_complete')`
- **Session count**: `sessionStorage.getItem('mdc_session_count')`

---

## M2 — Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |

---

## Next Steps (12-C to 12-D)

- 12-C: Attribution tracking (UTM parameters)
- 12-D: Dashboard/visualization layer
