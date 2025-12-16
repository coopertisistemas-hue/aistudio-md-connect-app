import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

export function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4 once on mount
        analytics.init();
    }, []);

    useEffect(() => {
        const handlePageView = () => {
            const path = location.pathname + location.search;
            analytics.pageView(path);
        };

        handlePageView();
    }, [location]);

    return null;
}
