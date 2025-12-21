import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

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
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: { ...corsHeaders },
            status: 204
        })
    }

    try {
        // Parse payload
        const payload: TrackEventPayload = await req.json()

        // Validate required fields
        const requiredFields = ['event_name', 'page_path', 'tenant_id', 'session_id'];
        const missingFields = requiredFields.filter(field => !payload[field as keyof TrackEventPayload]);

        if (missingFields.length > 0) {
            return new Response(
                JSON.stringify({
                    error: 'Missing required fields',
                    missing: missingFields
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 400
                }
            )
        }

        // Check rate limit
        if (!checkRateLimit(payload.session_id)) {
            return new Response(
                JSON.stringify({
                    error: 'Rate limit exceeded',
                    message: `Maximum ${RATE_LIMIT_MAX_EVENTS} events per minute per session`
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 429
                }
            )
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
            console.error('Database error:', error)
            return new Response(
                JSON.stringify({
                    error: 'Failed to insert event',
                    message: error.message
                }),
                {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    status: 500
                }
            )
        }

        return new Response(
            JSON.stringify({
                success: true,
                event_id: data.id,
                message: 'Event tracked successfully'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 201
            }
        )

    } catch (error) {
        console.error('Unexpected error:', error)
        return new Response(
            JSON.stringify({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
