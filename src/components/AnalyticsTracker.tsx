import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';

export function AnalyticsTracker() {
    const location = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        // Initialize GA4 once on mount
        analytics.init();

        // Track app session (growth analytics)
        const sessionCount = parseInt(sessionStorage.getItem('mdc_session_count') || '0', 10) + 1;
        sessionStorage.setItem('mdc_session_count', sessionCount.toString());

        if (sessionCount === 1) {
            analytics.trackEvent('app_session', { session_count: sessionCount });
        } else {
            analytics.trackEvent('return_visit', { session_count: sessionCount });
        }

        // Capture UTM parameters on first session
        const utmCaptured = sessionStorage.getItem('mdc_utm_captured');
        if (!utmCaptured) {
            const utmParams = analytics.getUTMParams();
            if (utmParams.utm_source || utmParams.utm_medium || utmParams.utm_campaign) {
                analytics.trackEvent('attribution_captured', {
                    utm_source: utmParams.utm_source,
                    utm_medium: utmParams.utm_medium,
                    utm_campaign: utmParams.utm_campaign,
                    utm_term: utmParams.utm_term,
                    utm_content: utmParams.utm_content,
                });
                sessionStorage.setItem('mdc_utm_captured', 'true');
            }
        }
    }, []);

    useEffect(() => {
        const handlePageView = () => {
            const path = location.pathname + location.search;

            // GA4 tracking (existing)
            analytics.pageView(path);

            // Backend tracking (new)
            analytics.trackEvent('page_view', {
                user_id: user?.id,
                meta: {
                    search: location.search,
                    hash: location.hash,
                    referrer: document.referrer
                }
            });
        };

        handlePageView();
    }, [location, user]);

    return null;
}
