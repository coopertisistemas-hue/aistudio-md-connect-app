/**
 * Rate Limiting Utilities for AI-Heavy Edge Functions
 * 
 * Provides lightweight in-memory rate limiting:
 * - Per-IP rate limiting
 * - Returns standardized error { ok: false, error: { code, message } }
 * - Uses safe messages (no internal details)
 * 
 * Note: This is in-memory and resets on function cold start.
 * For production, consider Supabase external storage or Redis.
 */

import { errBody, ERR } from './error.ts';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

interface RateLimitEntry {
    count: number;
    firstRequestTime: number;
}

const ipRateLimits = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; error?: ReturnType<typeof errBody> } {
    const now = Date.now();
    const entry = ipRateLimits.get(ip);
    
    if (!entry) {
        ipRateLimits.set(ip, { count: 1, firstRequestTime: now });
        return { allowed: true };
    }
    
    if (now - entry.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
        ipRateLimits.set(ip, { count: 1, firstRequestTime: now });
        return { allowed: true };
    }
    
    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
        return {
            allowed: false,
            error: errBody(ERR.RATE_LIMITED, 'Too many requests. Please try again later.')
        };
    }
    
    entry.count++;
    ipRateLimits.set(ip, entry);
    return { allowed: true };
}

export function getClientIp(req: Request): string {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0].trim();
    }
    return req.headers.get('cf-connecting-ip') || 
           req.headers.get('x-real-ip') || 
           'unknown';
}

export function generateRequestId(): string {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export async function withObservability<T>(
    fn: () => Promise<T>,
    endpointName: string,
    requestId: string
): Promise<{ result: T; durationMs: number }> {
    const startTime = Date.now();
    try {
        const result = await fn();
        const durationMs = Date.now() - startTime;
        console.log(`[${endpointName}] request_id=${requestId} duration_ms=${durationMs} status=success`);
        return { result, durationMs };
    } catch (err) {
        const durationMs = Date.now() - startTime;
        console.error(`[${endpointName}] request_id=${requestId} duration_ms=${durationMs} status=error`);
        throw err;
    }
}
