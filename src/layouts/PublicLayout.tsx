import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppBackground } from '@/components/layout/AppBackground';
import { SupportFooter } from '@/components/monetization/SupportFooter';
import { HomeReturnPill } from '@/components/navigation/HomeReturnPill';

export const PublicLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine if we should show the back button (Not on Home)
    const isHome = location.pathname === '/' || location.pathname === '/home';

    const handleBack = () => {
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col relative isolate">
            <AppBackground />

            {/* Standard Public Header (formerly TopBar) */}
            <PublicHeader />

            {/* Unified Transparent Wrapper (Video Background visible on all pages) */}
            <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)]">
                {/* Main Content */}
                <main className="flex-1 w-full pb-12">
                    {/* Global Back Button (Except Home) */}


                    <Outlet />
                </main>

                {/* Footers (Inside the glass wrapper) */}
                <HomeReturnPill />
                {!isHome && <SupportFooter />}
                <AppFooter />
            </div>
        </div>
    );
};
