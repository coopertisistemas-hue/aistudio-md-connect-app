// Error Reporter
// Premium fail-safe error reporting that NEVER breaks the app

import { getOrCreateAnonId, getOrCreateSessionId } from './identity';

// Feature flag
const ENABLED = import.meta.env.VITE_ERROR_REPORTING_ENABLED === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const APP_ENV = import.meta.env.VITE_APP_ENV || 'dev';
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Client-side deduplication cache (fingerprint -> timestamp)
const reportedErrors = new Map<string, number>();
const DEDUPE_WINDOW_MS = 60000; // 60 seconds

interface ErrorContext {
    source?: 'window_error' | 'unhandled_rejection' | 'react_boundary';
    extra?: Record<string, any>;
}

interface ErrorPayload {
    env: string;
    app_version: string;
    route: string;
    message: string;
    name?: string;
    stack?: string;
    severity: string;
    anon_id: string;
    session_id: string;
    user_agent: string;
    meta?: Record<string, any>;
    fingerprint: string;
}

/**
 * Build fingerprint for error deduplication
 * Combines name + message + route for unique signature
 */
export function buildFingerprint(error: Error, route: string): string {
    try {
        const name = error.name || 'Error';
        const message = error.message || 'Unknown error';

        // Optional: include truncated stack for more precision
        const stackSnippet = error.stack
            ? error.stack.substring(0, 100).replace(/\s+/g, ' ')
            : '';

        const combined = `${name}:${message}:${route}:${stackSnippet}`;

        // Simple hash (not cryptographic, just for deduplication)
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        return `fp_${Math.abs(hash).toString(36)}`;
    } catch (err) {
        // Fallback if fingerprint generation fails
        return `fp_fallback_${Date.now()}`;
    }
}

/**
 * Report error to backend
 * NEVER throws - fails silently if something goes wrong
 */
export async function reportError(error: Error, context: ErrorContext = {}): Promise<void> {
    // NO-OP if disabled
    if (!ENABLED) {
        return;
    }

    try {
        // Get current route (pathname only, no query)
        const route = window.location.pathname;

        // Build fingerprint
        const fingerprint = buildFingerprint(error, route);

        // Client-side deduplication (60s window)
        const now = Date.now();
        const lastReported = reportedErrors.get(fingerprint);

        if (lastReported && (now - lastReported) < DEDUPE_WINDOW_MS) {
            // Already reported recently, skip
            return;
        }

        // Mark as reported
        reportedErrors.set(fingerprint, now);

        // Clean up old entries (prevent memory leak)
        if (reportedErrors.size > 100) {
            const oldestKey = reportedErrors.keys().next().value;
            reportedErrors.delete(oldestKey);
        }

        // Build payload
        const payload: ErrorPayload = {
            env: APP_ENV,
            app_version: APP_VERSION,
            route,
            message: error.message || 'Unknown error',
            name: error.name || 'Error',
            stack: error.stack || '',
            severity: 'error',
            anon_id: getOrCreateAnonId(),
            session_id: getOrCreateSessionId(),
            user_agent: navigator.userAgent,
            meta: {
                source: context.source || 'unknown',
                ...context.extra
            },
            fingerprint
        };

        // Send report (fire-and-forget)
        const endpoint = `${API_BASE_URL}/report-client-error`;
        const body = JSON.stringify(payload);

        // Try sendBeacon first (best for page unload scenarios)
        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon(endpoint, blob);
        } else {
            // Fallback to fetch with keepalive and timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);

            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body,
                keepalive: true,
                signal: controller.signal
            })
                .catch(() => {
                    // Fail silently - we don't want to break the app
                })
                .finally(() => {
                    clearTimeout(timeoutId);
                });
        }
    } catch (err) {
        // CRITICAL: Never throw in error reporter (anti-loop protection)
        // Fail silently
        console.warn('[ErrorReporter] Failed to report error:', err);
    }
}

/**
 * Report a custom error with message
 */
export function reportCustomError(message: string, context: ErrorContext = {}): void {
    const error = new Error(message);
    error.name = 'CustomError';
    reportError(error, context);
}
