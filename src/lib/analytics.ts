declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export interface TrackingEvent {
    name: 'nav_click' | 'cta_click' | 'content_open' | 'feature_usage' | 'login_status';
    element?: string;
    cta_name?: string;
    content_type?: 'mural' | 'study';
    content_id?: string;
    context?: 'public' | 'member' | 'admin' | 'ops';
    route_from?: string;
    route_to?: string;
    metadata?: Record<string, any>;
}

// Backend analytics event types
export type AnalyticsEventName =
    | 'page_view'
    | 'click_partner'
    | 'view_partner'
    | 'click_donate'
    | 'play_audio'
    | 'share_devotional';

interface UTMParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

class AnalyticsService {
    private isEnabled: boolean;
    private debugMode: boolean;
    private measurementId: string;
    private isInitialized: boolean = false;

    // Dedupe guard: track recently fired events to prevent double firing
    private recentEvents = new Map<string, number>();
    private readonly DEDUP_WINDOW_MS = 1000; // 1 second dedupe window

    // Backend analytics properties
    private sessionId: string | null = null;
    private utmParams: UTMParams = {};
    private tenantId: string = 'md-connect';

    constructor() {
        this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
        this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED === 'true';
        this.debugMode = import.meta.env.DEV;

        // Initialize session and UTM tracking
        this.initSession();
        this.captureUTMParams();
    }

    private isEventDuplicate(eventKey: string): boolean {
        const now = Date.now();
        const lastFired = this.recentEvents.get(eventKey);
        
        if (lastFired && (now - lastFired) < this.DEDUP_WINDOW_MS) {
            if (this.debugMode) {
                console.log(`📊 [Analytics] Dedupe: skipping duplicate event ${eventKey}`);
            }
            return true;
        }
        
        this.recentEvents.set(eventKey, now);
        
        // Cleanup old entries periodically
        if (this.recentEvents.size > 100) {
            for (const [key, ts] of this.recentEvents.entries()) {
                if (now - ts > this.DEDUP_WINDOW_MS * 2) {
                    this.recentEvents.delete(key);
                }
            }
        }
        
        return false;
    }

    public init() {
        if (!this.isEnabled || this.isInitialized) return;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', this.measurementId, {
            send_page_view: false
        });

        this.isInitialized = true;
        if (this.debugMode) console.log(`📊 [Member] GA4 Initialized: ${this.measurementId}`);
    }

    public pageView(path: string, title?: string) {
        if (!this.isEnabled) return;

        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title || document.title,
            page_location: window.location.href
        });

        if (this.debugMode) console.log(`📊 [Member] Page View: ${path}`);
    }

    public track(event: TrackingEvent) {
        if (!this.isEnabled) {
            if (this.debugMode) {
                console.groupCollapsed(`📊 [Member] Analytics: ${event.name}`);
                console.log('Payload:', event);
                console.groupEnd();
            }
            return;
        }

        const dedupeKey = `track:${event.name}:${event.element || ''}`;
        if (this.isEventDuplicate(dedupeKey)) return;

        const { name, metadata, ...params } = event;
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );
        window.gtag('event', name, { ...cleanParams, ...metadata });

        if (this.debugMode) {
            console.groupCollapsed(`📊 [Member] Analytics Sent: ${name}`);
            console.log('Params:', cleanParams);
            console.groupEnd();
        }
    }

    // Session Management
    private initSession() {
        const stored = sessionStorage.getItem('analytics_session_id');
        if (stored) {
            this.sessionId = stored;
        } else {
            this.sessionId = crypto.randomUUID();
            sessionStorage.setItem('analytics_session_id', this.sessionId);
        }
    }

    // UTM Parameters Capture
    private captureUTMParams() {
        const params = new URLSearchParams(window.location.search);
        const utmKeys: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

        utmKeys.forEach(key => {
            const value = params.get(key);
            if (value) {
                this.utmParams[key] = value;
                sessionStorage.setItem(key, value);
            } else {
                const stored = sessionStorage.getItem(key);
                if (stored) this.utmParams[key] = stored;
            }
        });
    }

    // Public getters
    public getSessionId(): string | null {
        return this.sessionId;
    }

    public getUTMParams(): UTMParams {
        return { ...this.utmParams };
    }

    // Backend Event Tracking
    public async trackEvent(
        eventName: AnalyticsEventName,
        payload?: Record<string, unknown>,
        context?: string
    ): Promise<void> {
        // Disable backend tracking in development due to CORS
        // Enable in production by setting VITE_ENABLE_BACKEND_ANALYTICS=true
        const enableBackendTracking = import.meta.env.VITE_ENABLE_BACKEND_ANALYTICS === 'true';

        if (!enableBackendTracking) {
            if (this.debugMode) {
                console.log(`📊 [Analytics] Backend tracking disabled (dev mode). Event: ${eventName}`);
            }
            return;
        }

        // Dedupe guard for backend events
        const dedupeKey = `trackEvent:${eventName}:${JSON.stringify(payload || {})}`;
        if (this.isEventDuplicate(dedupeKey)) return;

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const eventPayload: Record<string, unknown> = {
                event_name: eventName,
                page_path: window.location.pathname,
                tenant_id: this.tenantId,
                session_id: this.sessionId,
                ...this.utmParams,
            };

            // Add payload and context if provided, stripping undefined values
            if (payload) {
                const cleanPayload = Object.fromEntries(
                    Object.entries(payload).filter(([_, v]) => v !== undefined)
                );
                if (Object.keys(cleanPayload).length > 0) {
                    eventPayload.payload = cleanPayload;
                }
            }
            if (context !== undefined) {
                eventPayload.context = context;
            }

            if (this.debugMode) {
                console.log(`📊 [Analytics] trackEvent: ${eventName}`, eventPayload);
            }

            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                clearTimeout(timeoutId);
                if (this.debugMode) console.warn('📊 [Analytics] Supabase credentials not configured');
                return;
            }

            await fetch(`${supabaseUrl}/functions/v1/track-event`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseAnonKey}`
                },
                body: JSON.stringify(eventPayload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
        } catch (error) {
            // Fail silently to not disrupt user experience
            if (this.debugMode) {
                console.error('📊 [Analytics] Failed to track event:', error);
            }
        }
    }
}

export const analytics = new AnalyticsService();
