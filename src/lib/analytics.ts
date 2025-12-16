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

class AnalyticsService {
    private isEnabled: boolean;
    private debugMode: boolean;
    private measurementId: string;
    private isInitialized: boolean = false;

    constructor() {
        this.measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';
        this.isEnabled = !!this.measurementId && import.meta.env.VITE_ANALYTICS_ENABLED !== 'false';
        this.debugMode = import.meta.env.DEV;
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

        const { name, metadata, ...params } = event;
        window.gtag('event', name, { ...params, ...metadata });

        if (this.debugMode) {
            console.groupCollapsed(`📊 [Member] Analytics Sent: ${name}`);
            console.log('Params:', params);
            console.groupEnd();
        }
    }
}

export const analytics = new AnalyticsService();
