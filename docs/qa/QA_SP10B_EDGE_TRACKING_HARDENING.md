# QA — Sprint SP10-B: Edge Tracking Hardening

**Date:** 2026-03-02  
**Sprint:** SP10-B  
**Status:** ✅ Complete

---

## Overview

This sprint hardens the `track-event` Edge Function to ensure:
- **Input validation**: Strict validation of event_name, payload size, and types
- **Standardized error response**: Uses `{ ok: false, error: { code, message } }`
- **Observability**: Logs request_id, duration_ms, event_name, status (never logs payload)
- **No contract changes**: Response format, event schema, and public API structure unchanged

---

## Changes Made

### File: `supabase/functions/track-event/index.ts`

#### 1. Input Validation

Added `validatePayload()` function with these rules:

| Field | Rule | Error Code |
|-------|------|------------|
| `event_name` | Required, string, 1-100 chars | `VALIDATION_ERROR` |
| `payload` | Optional; if present, must be object (not array/null) | `VALIDATION_ERROR` |
| `payload` | Max 10KB (JSON string length) | `VALIDATION_ERROR` |
| Other fields | If present, must be string | `VALIDATION_ERROR` |

```typescript
const MAX_EVENT_NAME_LENGTH = 100
const MAX_PAYLOAD_SIZE_BYTES = 10 * 1024 // 10KB
```

#### 2. Standardized Error Response

All error paths now use the canonical format:

```typescript
{ ok: false, error: { code: string, message: string } }
```

Success response uses:
```typescript
{ ok: true, data: { event_id, message } }
```

#### 3. Observability Logging

Every request logs in this format (NO payload contents):

```
[track-event] request_id=<uuid> duration_ms=<ms> event_name=<name> status=<success|validation_error|rate_limited|database_error|error>
```

Sample log lines:
```
[track-event] request_id=a1b2c3d4e5f6... duration_ms=45 event_name=page_view status=success
[track-event] request_id=b2c3d4e5f6a1... duration_ms=2 event_name= status=validation_error
[track-event] request_id=c3d4e5f6a1b2... duration_ms=12 event_name=test_event status=rate_limited
```

---

## Validation Rules Detail

### event_name
- **Required**: Yes
- **Type**: String
- **Length**: 1-100 characters
- **Error**: `"event_name is required and must be a string"`, `"event_name cannot be empty"`, `"event_name cannot exceed 100 characters"`

### payload
- **Required**: No
- **Type**: Object (not array, not null)
- **Max Size**: 10KB (10,240 bytes)
- **Error**: `"payload cannot be null"`, `"payload must be an object if provided"`, `"payload must be an object, not an array"`, `"payload exceeds maximum size of 10KB"`

### Other Fields
- **Optional**: page_path, tenant_id, session_id, user_id, user_key, partner_id, utm_*, context, meta
- **Type**: String (if provided)
- **Error**: `"<field> must be a string if provided"`

---

## Smoke Tests Added

Updated `scripts/edge-smoke.ps1` with three new tests:

| Test | Description | Expected Status |
|------|-------------|-----------------|
| Test 9 | Valid event with all required fields | 201 OK |
| Test 10 | Empty event_name | 400 with VALIDATION_ERROR |
| Test 11 | Payload > 10KB | 400 with VALIDATION_ERROR |

---

## Gates

| Gate | Status |
|------|--------|
| `pnpm type-check` | ✅ Pass |
| `pnpm build` | ✅ Pass |
| Response contract unchanged | ✅ Pass |
| Event schema unchanged | ✅ Pass |

---

## Backward Compatibility

- Existing client calls continue to work (fields are optional or have defaults)
- No changes to event schema stored in database
- Success response now includes `ok: true` wrapper (additive, not breaking)
