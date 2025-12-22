// Identity Management
// Manages anonymous user ID and session ID with 24h rotation

const ANON_ID_KEY = 'md_anon_id';
const SESSION_ID_KEY = 'md_session_id';
const SESSION_STARTED_KEY = 'md_session_started_at';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a simple UUID v4
 */
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Get or create anonymous user ID
 * Persists in localStorage, never rotates
 */
export function getOrCreateAnonId(): string {
    try {
        let anonId = localStorage.getItem(ANON_ID_KEY);

        if (!anonId) {
            anonId = generateUUID();
            localStorage.setItem(ANON_ID_KEY, anonId);
        }

        return anonId;
    } catch (error) {
        // Fallback if localStorage is not available
        return 'anon-' + Date.now();
    }
}

/**
 * Get or create session ID
 * Rotates every 24 hours
 */
export function getOrCreateSessionId(): string {
    try {
        const now = Date.now();
        const sessionId = localStorage.getItem(SESSION_ID_KEY);
        const sessionStartedAt = localStorage.getItem(SESSION_STARTED_KEY);

        // Check if session exists and is still valid (< 24h)
        if (sessionId && sessionStartedAt) {
            const startedAt = parseInt(sessionStartedAt, 10);
            const elapsed = now - startedAt;

            if (elapsed < SESSION_DURATION_MS) {
                // Session is still valid
                return sessionId;
            }
        }

        // Create new session
        const newSessionId = generateUUID();
        localStorage.setItem(SESSION_ID_KEY, newSessionId);
        localStorage.setItem(SESSION_STARTED_KEY, now.toString());

        return newSessionId;
    } catch (error) {
        // Fallback if localStorage is not available
        return 'session-' + Date.now();
    }
}

/**
 * Initialize identity (call on app bootstrap)
 */
export function initializeIdentity(): void {
    getOrCreateAnonId();
    getOrCreateSessionId();
}
