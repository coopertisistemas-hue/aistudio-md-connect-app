# QA — Phase 6: Monetization Intelligence

**Date:** 2026-03-02  
**Phase:** 6  
**Status:** ✅ Complete

---

## Overview

This phase adds monetization intelligence tracking to measure revenue-generating actions and partner engagement.

---

## M0 — Scope

- Track donation flow (views, clicks, initiation, completion)
- Track partner inquiries and service requests
- Track affiliate link clicks

---

## M1 — Implementation

### New Monetization Events Added

| Event | Category | Trigger | Parameters |
|-------|----------|---------|------------|
| `donate_view` | Engagement | User loads donation page | `donation_type` |
| `donate_click` | Conversion | User clicks donation option | `donation_type`, `amount` |
| `donate_initiated` | Conversion | User starts donation | `donation_type`, `payment_method` |
| `donate_complete` | Conversion | User completes donation | `donation_type`, `amount`, `payment_method` |
| `partner_inquiry` | Conversion | User submits partner inquiry | `partner_id`, `partner_type` |
| `service_request` | Conversion | User requests service via WhatsApp | `service_id`, `service_type` |
| `affiliate_click` | Conversion | User clicks affiliate link | `affiliate_id`, `affiliate_category` |

### Files Modified

1. **`src/lib/event-taxonomy.ts`**
   - Added 7 new monetization events

2. **`src/lib/analytics.ts`**
   - Added new event types to AnalyticsEventName

3. **`src/pages/public/DonatePage.tsx`**
   - Added `donate_view` on page load

4. **`src/pages/public/PartnerLeadPage.tsx`**
   - Added `partner_inquiry` on form submit

5. **`src/pages/Monetization/ServiceDetail.tsx`**
   - Added `service_request` on WhatsApp click

6. **`src/components/monetization/AffiliateCard.tsx`**
   - Added `affiliate_click` on card click

---

## M2 — Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |

---

## Phase Summary

This phase completes the monetization intelligence layer:

- **Donations**: Track PIX donation views and clicks
- **Partners**: Track partner inquiries
- **Services**: Track service requests  
- **Affiliates**: Track affiliate link clicks

All events follow the established taxonomy structure with proper categorization and parameters.

---

## Events Total

The app now tracks **18 backend events**:

| Category | Events |
|----------|--------|
| Engagement | page_view, play_audio, donate_view |
| Conversion | cta_click, click_partner, click_donate, donate_click, donate_initiated, donate_complete, partner_inquiry, service_request, affiliate_click, campaign_conversion |
| Acquisition | onboarding_start, church_selected, onboarding_complete, first_login, attribution_captured |
| Retention | share_devotional, return_visit |
