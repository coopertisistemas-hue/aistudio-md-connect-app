/**
 * Edge Function Error Utilities
 *
 * Provides a single canonical error response shape:
 *   { ok: false, error: { code: string, message: string } }
 *
 * Rules:
 * - Never expose raw internal error.message in production
 * - Never expose error.stack
 * - Use safeMessage() to wrap unknown errors generically
 */

/** Canonical error codes (add more as needed) */
export const ERR = {
    INVALID_REQUEST: 'INVALID_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    RATE_LIMITED: 'RATE_LIMITED',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    CONFIG_MISSING: 'CONFIG_MISSING',
    INTERNAL: 'INTERNAL',
} as const

export type ErrorCode = typeof ERR[keyof typeof ERR]

/**
 * Returns a safe generic message for unknown errors.
 * Never returns internal .message or .stack to the client.
 */
export function safeMessage(_err?: unknown): string {
    return 'Internal error'
}

/**
 * Build the canonical error response body.
 * Use this to construct the data arg for jsonResponse().
 *
 * Example:
 *   return jsonResponse(errBody(ERR.INVALID_REQUEST, 'Missing param X'), 400, origin)
 */
export function errBody(code: ErrorCode, message: string): { ok: false; error: { code: string; message: string } } {
    return { ok: false, error: { code, message } }
}
