# QA — Sprint 12-A: Event Taxonomy & Governance

**Date:** 2026-03-02  
**Sprint:** 12-A  
**Status:** ✅ Complete

---

## Overview

This sprint establishes a formal event taxonomy and governance framework for analytics tracking.

---

## M0 — Scope

- Define event categories (engagement, conversion, acquisition, retention)
- Create central event registry with type safety
- Establish governance rules for adding new events

---

## M1 — Implementation

### File Created

**`src/lib/event-taxonomy.ts`**

Centralized event taxonomy with:

1. **Event Categories**:
   - `ENGAGEMENT` - User interactions
   - `CONVERSION` - CTA clicks, donations
   - `ACQUISITION` - Login, signups
   - `RETENTION` - Shares, repeat usage

2. **GA4 Events** (frontend-only):
   | Event | Category | Description |
   |-------|----------|-------------|
   | `nav_click` | Engagement | Navigation clicks |
   | `cta_click` | Conversion | CTA button clicks |
   | `content_open` | Engagement | Content opens |
   | `feature_usage` | Engagement | Feature interactions |
   | `login_status` | Acquisition | Auth state changes |

3. **Backend Events** (stored in DB):
   | Event | Category | Description |
   |-------|----------|-------------|
   | `page_view` | Engagement | Page views |
   | `click_partner` | Conversion | Partner clicks |
   | `view_partner` | Engagement | Partner views |
   | `click_donate` | Conversion | Donation clicks |
   | `play_audio` | Engagement | Audio plays |
   | `share_devotional` | Retention | Devotional shares |

4. **Governance Rules**:
   - Event names: snake_case, max 50 chars
   - Format: verb_noun (e.g., `click_partner`)
   - No PII in parameters
   - Max 25 parameters per event

5. **Utilities**:
   - `isValidEventName()` - Validate event format
   - `getRegisteredEventNames()` - List all events

---

## M2 — Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |

---

## Next Steps (12-B to 12-D)

- 12-B: Growth analytics instrumentation
- 12-C: Attribution tracking
- 12-D: Dashboard/visualization layer
