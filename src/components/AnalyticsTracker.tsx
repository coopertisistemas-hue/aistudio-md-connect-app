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
