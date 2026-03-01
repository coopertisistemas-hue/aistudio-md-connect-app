import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { errBody, ERR } from '../_shared/error.ts'

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
    meta?: Record<string, any>;
}

serve(async (req) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');

    try {
        // Parse payload
        const payload: TrackEventPayload = await req.json()

        // Validate required fields
        const requiredFields = ['event_name', 'page_path', 'tenant_id', 'session_id'];
        const missingFields = requiredFields.filter(field => !payload[field as keyof TrackEventPayload]);

        if (missingFields.length > 0) {
            return jsonResponse(errBody(ERR.INVALID_REQUEST, `Missing required fields: ${missingFields.join(', ')}`), 400, origin)
        }

        // Check rate limit
        if (!checkRateLimit(payload.session_id)) {
            return jsonResponse(errBody(ERR.RATE_LIMITED, 'Rate limit exceeded'), 429, origin)
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
                meta: payload.meta || {}
            })
            .select('id')
            .single()

        if (error) {
            console.error('[track-event] Database error:', error)
            return jsonResponse(errBody(ERR.DATABASE_ERROR, 'Failed to record event'), 500, origin)
        }

        return jsonResponse({
            success: true,
            event_id: data.id,
            message: 'Event tracked successfully'
        }, 201, origin)

    } catch (error) {
        console.error('[track-event] Unexpected error:', error)
        return jsonResponse(errBody(ERR.INTERNAL, 'Internal error'), 500, origin)
    }
})
