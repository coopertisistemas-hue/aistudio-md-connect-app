// Edge Function: report-client-error
// Premium error reporting with validation, sanitization, rate limiting, and deduplication

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { handleCors, jsonResponse } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

interface ErrorReportPayload {
    env: string;
    app_version: string;
    route: string;
    message: string;
    name?: string;
    stack?: string;
    severity?: string;
    anon_id?: string;
    session_id?: string;
    user_agent?: string;
    meta?: Record<string, any>;
    fingerprint: string;
}

// PII detection patterns
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;

// Sanitize text to remove PII
function sanitizeText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';

    let sanitized = text
        .replace(EMAIL_PATTERN, '[EMAIL_REMOVED]')
        .replace(PHONE_PATTERN, '[PHONE_REMOVED]');

    if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength) + '...';
    }

    return sanitized;
}

// Extract pathname from route (remove query params)
function sanitizeRoute(route: string): string {
    try {
        const url = new URL(route, 'http://dummy.com');
        return url.pathname;
    } catch {
        // If not a valid URL, just remove query params
        return route.split('?')[0].substring(0, 200);
    }
}

// Validate required fields
function validatePayload(payload: any): { valid: boolean; error?: string } {
    if (!payload) {
        return { valid: false, error: 'Missing payload' };
    }

    const required = ['env', 'app_version', 'route', 'message', 'fingerprint'];
    for (const field of required) {
        if (!payload[field]) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }

    const validEnvs = ['dev', 'preview', 'prod'];
    if (!validEnvs.includes(payload.env)) {
        return { valid: false, error: 'Invalid env value' };
    }

    return { valid: true };
}

serve(async (req) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get origin for CORS validation
    const origin = req.headers.get('origin');

    try {
        // Parse payload
        const payload: ErrorReportPayload = await req.json();

        // Validate
        const validation = validatePayload(payload);
        if (!validation.valid) {
            return jsonResponse({ ok: false, reason: 'validation_error', details: validation.error }, 400, origin);
        }

        // Initialize Supabase client with service role
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Rate limiting (session-based)
        if (payload.session_id) {
            const sixtySecondsAgo = new Date(Date.now() - 60000).toISOString();
            const { count } = await supabase
                .from('client_error_reports')
                .select('*', { count: 'exact', head: true })
                .eq('session_id', payload.session_id)
                .gte('created_at', sixtySecondsAgo);

            if (count && count >= 20) {
                return jsonResponse({ ok: false, reason: 'rate_limited' }, 429, origin);
            }
        }

        // Sanitize fields
        const sanitizedMessage = sanitizeText(payload.message, 500);
        const sanitizedStack = sanitizeText(payload.stack, 4000);
        const sanitizedUserAgent = sanitizeText(payload.user_agent, 300);
        const sanitizedRoute = sanitizeRoute(payload.route);

        // Deduplication (10min window)
        const tenMinutesAgo = new Date(Date.now() - 600000).toISOString();
        const { data: existing } = await supabase
            .from('client_error_reports')
            .select('*')
            .eq('fingerprint', payload.fingerprint)
            .gte('created_at', tenMinutesAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (existing) {
            // Deduplicate: increment occurrences
            const { error: updateError } = await supabase
                .from('client_error_reports')
                .update({
                    occurrences: existing.occurrences + 1,
                    last_seen_at: new Date().toISOString(),
                    // Optionally merge meta (keep it small)
                    meta: payload.meta ? { ...existing.meta, ...payload.meta } : existing.meta
                })
                .eq('id', existing.id);

            if (updateError) throw updateError;

            return jsonResponse({ ok: true, action: 'deduped' }, 200, origin);
        }

        // Insert new error report
        const { error: insertError } = await supabase
            .from('client_error_reports')
            .insert({
                env: payload.env,
                app_version: payload.app_version,
                route: sanitizedRoute,
                message: sanitizedMessage,
                name: payload.name || null,
                stack: sanitizedStack || null,
                severity: payload.severity || 'error',
                anon_id: payload.anon_id || null,
                session_id: payload.session_id || null,
                user_agent: sanitizedUserAgent || null,
                meta: payload.meta || null,
                fingerprint: payload.fingerprint,
                first_seen_at: new Date().toISOString(),
                last_seen_at: new Date().toISOString(),
                occurrences: 1
            });

        if (insertError) throw insertError;

        return jsonResponse({ ok: true, action: 'inserted' }, 200, origin);

    } catch (error) {
        console.error('Error reporting function error:', error);
        return jsonResponse({ ok: false, reason: 'internal_error' }, 500, origin);
    }
});
