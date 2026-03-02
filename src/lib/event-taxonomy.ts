/**
 * MD Connect — Event Taxonomy & Governance
 * 
 * This file centralizes all analytics event definitions and governance rules.
 * 
 * TAXONOMY STRUCTURE:
 * - Category: High-level grouping (engagement, conversion, acquisition, retention)
 * - Event: Specific action being tracked
 * - Parameters: Contextual data attached to events
 * 
 * GOVERNANCE RULES:
 * 1. All events must be defined here before use
 * 2. Event names: snake_case, max 50 chars, verb_noun format
 * 3. Parameters: documented per event, max 25 params
 * 4. No PII in event parameters
 * 5. Backend events validated by track-event Edge Function
 */

export const EVENT_CATEGORIES = {
    ENGAGEMENT: 'engagement',
    CONVERSION: 'conversion',
    ACQUISITION: 'acquisition',
    RETENTION: 'retention',
} as const;

export type EventCategory = typeof EVENT_CATEGORIES[keyof typeof EVENT_CATEGORIES];

/**
 * GA4 Event Taxonomy
 * Tracked via analytics.track() - frontend-only
 */
export const GA4_EVENTS = {
    // Navigation
    NAV_CLICK: {
        name: 'nav_click' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User clicks navigation element',
        parameters: ['element', 'route_to'],
    },
    
    // CTAs
    CTA_CLICK: {
        name: 'cta_click' as const,
        category: EVENT_CATEGORIES.CONVERSION,
        description: 'User clicks call-to-action button',
        parameters: ['cta_name', 'element'],
    },
    
    // Content
    CONTENT_OPEN: {
        name: 'content_open' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User opens content item',
        parameters: ['content_type', 'content_id'],
    },
    
    // Feature Usage
    FEATURE_USAGE: {
        name: 'feature_usage' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User interacts with app feature',
        parameters: ['element', 'context', 'metadata'],
    },
    
    // Auth
    LOGIN_STATUS: {
        name: 'login_status' as const,
        category: EVENT_CATEGORIES.ACQUISITION,
        description: 'Login state change',
        parameters: [],
    },
} as const;

/**
 * Backend Event Taxonomy
 * Tracked via analytics.trackEvent() - stored in database
 */
export const BACKEND_EVENTS = {
    // Page Views
    PAGE_VIEW: {
        name: 'page_view' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User views a page',
        parameters: ['page_path'],
    },
    
    // Partner/Monetization
    CLICK_PARTNER: {
        name: 'click_partner' as const,
        category: EVENT_CATEGORIES.CONVERSION,
        description: 'User clicks partner/service link',
        parameters: ['partner_id'],
    },
    VIEW_PARTNER: {
        name: 'view_partner' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User views partner/service detail',
        parameters: ['partner_id'],
    },
    CLICK_DONATE: {
        name: 'click_donate' as const,
        category: EVENT_CATEGORIES.CONVERSION,
        description: 'User clicks donation option',
        parameters: [],
    },
    
    // Audio/Radio
    PLAY_AUDIO: {
        name: 'play_audio' as const,
        category: EVENT_CATEGORIES.ENGAGEMENT,
        description: 'User plays audio/radio stream',
        parameters: [],
    },
    
    // Devotionals
    SHARE_DEVOTIONAL: {
        name: 'share_devotional' as const,
        category: EVENT_CATEGORIES.RETENTION,
        description: 'User shares devotional content',
        parameters: [],
    },
} as const;

/**
 * Type exports for GA4 events
 */
export type GA4EventName = typeof GA4_EVENTS[keyof typeof GA4_EVENTS]['name'];
export type GA4EventParams<T extends GA4EventName> = 
    (typeof GA4_EVENTS)[keyof typeof GA4_EVENTS] & { name: T } extends { parameters: infer P } ? P : never;

/**
 * Type exports for backend events
 */
export type BackendEventName = typeof BACKEND_EVENTS[keyof typeof BACKEND_EVENTS]['name'];
export type BackendEventParams<T extends BackendEventName> = 
    (typeof BACKEND_EVENTS)[keyof typeof BACKEND_EVENTS] & { name: T } extends { parameters: infer P } ? P : never;

/**
 * Governance: Validate event name format
 * @param name - Event name to validate
 * @returns true if valid
 */
export function isValidEventName(name: string): boolean {
    // Must be snake_case, max 50 chars
    const snakeCaseRegex = /^[a-z][a-z0-9_]*$/;
    return snakeCaseRegex.test(name) && name.length <= 50;
}

/**
 * Governance: Get all registered event names
 * @returns Array of all valid event names
 */
export function getRegisteredEventNames(): { ga4: string[]; backend: string[] } {
    return {
        ga4: Object.values(GA4_EVENTS).map(e => e.name),
        backend: Object.values(BACKEND_EVENTS).map(e => e.name),
    };
}
