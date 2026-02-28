/**
 * CORS Security Configuration for Edge Functions
 * 
 * SECURITY POLICY:
 * - Strict origin allowlist by environment
 * - No wildcard (*) origins in production
 * - 403 response for unauthorized origins
 */

// Environment-based allowed origins
const ALLOWED_ORIGINS = [
    // Production domains
    'https://mdconnect.app',
    'https://www.mdconnect.app',
    'https://ipda.mdconnect.app',
    
    // Vercel preview deployments (for staging/preview)
    // Pattern: https://<project>-<hash>-<scope>.vercel.app
    /^https:\/\/.*\.vercel\.app$/,
    
    // Local development
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4173',  // Vite preview server
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173',
]

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false

    return ALLOWED_ORIGINS.some(allowed => {
        if (typeof allowed === 'string') {
            return allowed === origin
        }
        // RegExp pattern (e.g., for Vercel preview URLs)
        return allowed.test(origin)
    })
}

/**
 * Get CORS headers for a specific origin
 */
function getCorsHeaders(origin: string | null): HeadersInit {
    const baseHeaders = {
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    }

    // Only set Access-Control-Allow-Origin if origin is allowed
    if (origin && isOriginAllowed(origin)) {
        return {
            ...baseHeaders,
            'Access-Control-Allow-Origin': origin,
            'Vary': 'Origin', // Important: cache responses per origin
        }
    }

    // No CORS headers for disallowed origins
    return baseHeaders
}

/**
 * Handle CORS preflight (OPTIONS) requests
 * Returns 403 for disallowed origins
 */
export function handleCors(req: Request): Response | null {
    const origin = req.headers.get('origin')

    if (req.method === 'OPTIONS') {
        // Validate origin for preflight
        if (!isOriginAllowed(origin)) {
            return new Response(
                JSON.stringify({
                    error: 'Forbidden',
                    message: 'Origin not allowed'
                }),
                {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        return new Response('ok', {
            headers: getCorsHeaders(origin),
            status: 204
        })
    }

    return null
}

/**
 * Create JSON response with CORS headers
 * Returns 403 for disallowed origins
 */
export function jsonResponse(data: unknown, status = 200, requestOrigin: string | null = null): Response {
    // Validate origin
    if (requestOrigin && !isOriginAllowed(requestOrigin)) {
        return new Response(
            JSON.stringify({
                error: 'Forbidden',
                message: 'Origin not allowed'
            }),
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }

    return new Response(
        JSON.stringify(data),
        {
            headers: {
                ...getCorsHeaders(requestOrigin),
                'Content-Type': 'application/json'
            },
            status,
        },
    )
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use jsonResponse with origin parameter instead
 */
export const corsHeaders = {
    'Access-Control-Allow-Origin': '',  // Empty - forces use of new API
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
}