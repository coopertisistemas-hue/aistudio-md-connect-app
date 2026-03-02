import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

const MAX_EVENT_NAME_LENGTH = 100
const MAX_PAYLOAD_SIZE_BYTES = 10 * 1024 // 10KB

// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_EVENTS = 60; // 60 events per minute

function checkRateLimit(sessionId: string): boolean {
    const now = Date.now();
    const record = rateLimiter.get(sessionId);

    if (!record || now > record.resetAt) {
        // Create new window
        rateLimiter.set(sessionId, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS
        });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX_EVENTS) {
        return false; // Rate limit exceeded
    }

    // Increment count
    record.count++;
    return true;
}

// Cleanup old rate limit entries periodically (prevent memory leak)
setInterval(() => {
    const now = Date.now();
    for (const [sessionId, record] of rateLimiter.entries()) {
        if (now > record.resetAt) {
            rateLimiter.delete(sessionId);
        }
    }
}, 5 * 60 * 1000); // Cleanup every 5 minutes

interface TrackEventPayload {
    event_name: string;
    page_path: string;
    tenant_id: string;
    session_id: string;
    user_id?: string;
    user_key?: string;
    partner_id?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    payload?: Record<string, unknown>;
    context?: string;
    meta?: Record<string, any>;
}

function validatePayload(body: unknown): { valid: boolean; error?: string; data?: TrackEventPayload } {
    if (!body || typeof body !== 'object') {
        return { valid: false, error: 'Request body must be a valid JSON object' };
    }

    const data = body as Record<string, unknown>;

    // event_name: required, string, max 100 chars
    if (typeof data.event_name !== 'string') {
        return { valid: false, error: 'event_name is required and must be a string' };
    }
    if (data.event_name.length === 0) {
        return { valid: false, error: 'event_name cannot be empty' };
    }
    if (data.event_name.length > MAX_EVENT_NAME_LENGTH) {
        return { valid: false, error: `event_name cannot exceed ${MAX_EVENT_NAME_LENGTH} characters` };
    }

    // payload: optional, but must be object if present
    if (data.payload !== undefined) {
        if (data.payload === null) {
            return { valid: false, error: 'payload cannot be null' };
        }
        if (typeof data.payload !== 'object') {
            return { valid: false, error: 'payload must be an object if provided' };
        }
        if (Array.isArray(data.payload)) {
            return { valid: false, error: 'payload must be an object, not an array' };
        }

        // Check payload size (JSON string length)
        const payloadJson = JSON.stringify(data.payload);
        if (payloadJson.length > MAX_PAYLOAD_SIZE_BYTES) {
            return { valid: false, error: `payload exceeds maximum size of ${MAX_PAYLOAD_SIZE_BYTES / 1024}KB` };
        }
    }

    // Validate other fields are correct types if present
    const stringFields = ['page_path', 'tenant_id', 'session_id', 'user_id', 'user_key', 'partner_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'context'];
    for (const field of stringFields) {
        if (data[field] !== undefined && typeof data[field] !== 'string') {
            return { valid: false, error: `${field} must be a string if provided` };
        }
    }

    return { valid: true, data: data as TrackEventPayload };
}

function generateRequestId(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');
    const requestId = generateRequestId();
    const startTime = Date.now();

    // Default observability data (will be updated based on request outcome)
    let observabilityData = {
        request_id: requestId,
        duration_ms: 0,
        event_name: 'unknown',
        status: 'error'
    };

    try {
        // Parse payload
        let body: unknown;
        try {
            body = await req.json();
        } catch {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, 'Invalid JSON body'), 400, origin);
        }

        // Validate input
        const validation = validatePayload(body);
        if (!validation.valid) {
            observabilityData.status = 'validation_error';
            observabilityData.duration_ms = Date.now() - startTime;
            console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);
            return jsonResponse(errBody(ERR.VALIDATION_ERROR, validation.error!), 400, origin);
        }

        const payload = validation.data!;
        observabilityData.event_name = payload.event_name;

        // Validate required fields
        const requiredFields = ['event_name', 'page_path', 'tenant_id', 'session_id'];
        const missingFields = requiredFields.filter(field => !payload[field as keyof TrackEventPayload]);

        if (missingFields.length > 0) {
            observabilityData.status = 'validation_error';
            observabilityData.duration_ms = Date.now() - startTime;
            console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);
            return jsonResponse(errBody(ERR.INVALID_REQUEST, `Missing required fields: ${missingFields.join(', ')}`), 400, origin);
        }

        // Check rate limit
        if (!checkRateLimit(payload.session_id)) {
            observabilityData.status = 'rate_limited';
            observabilityData.duration_ms = Date.now() - startTime;
            console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);
            return jsonResponse(errBody(ERR.RATE_LIMITED, 'Rate limit exceeded'), 429, origin);
        }

        // Create Supabase client with service role
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Insert event
        const { data, error } = await supabaseClient
            .from('analytics_events')
            .insert({
                event_name: payload.event_name,
                page_path: payload.page_path,
                tenant_id: payload.tenant_id,
                session_id: payload.session_id,
                user_id: payload.user_id || null,
                user_key: payload.user_key || null,
                partner_id: payload.partner_id || null,
                utm_source: payload.utm_source || null,
                utm_medium: payload.utm_medium || null,
                utm_campaign: payload.utm_campaign || null,
                utm_term: payload.utm_term || null,
                utm_content: payload.utm_content || null,
                meta: (payload.meta as Record<string, unknown>) || {}
            })
            .select('id')
            .single()

        if (error) {
            console.error(`[track-event] request_id=${requestId} database_error:`, error);
            observabilityData.status = 'database_error';
            observabilityData.duration_ms = Date.now() - startTime;
            console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);
            return jsonResponse(errBody(ERR.DATABASE_ERROR, 'Failed to record event'), 500, origin);
        }

        observabilityData.status = 'success';
        observabilityData.duration_ms = Date.now() - startTime;
        console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);

        return jsonResponse({
            ok: true,
            data: {
                event_id: data.id,
                message: 'Event tracked successfully'
            }
        }, 201, origin);

    } catch (error) {
        console.error(`[track-event] request_id=${requestId} unexpected_error:`, error);
        observabilityData.status = 'error';
        observabilityData.duration_ms = Date.now() - startTime;
        console.log(`[track-event] request_id=${requestId} duration_ms=${observabilityData.duration_ms} event_name=${observabilityData.event_name} status=${observabilityData.status}`);
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin);
    }
})
