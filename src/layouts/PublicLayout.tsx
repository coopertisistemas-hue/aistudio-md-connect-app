import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppBackground } from '@/components/layout/AppBackground';
import { SupportFooter } from '@/components/monetization/SupportFooter';
import { HomeReturnPill } from '@/components/navigation/HomeReturnPill';

export const PublicLayout: React.FC = () => {
    const location = useLocation();

    // Determine if we should show the back button (Not on Home)
    const isHome = location.pathname === '/' || location.pathname === '/home';

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

                {/* 
                    Legacy Footer Handling:
                    For pages NOT using InternalPageLayout, we render footers here.
                    For pages using InternalPageLayout (listed below), we skip them here 
                    so the layout can handle them (preventing duplicates).
                */}
                {!isHome && !location.pathname.startsWith('/devocionais') && <SupportFooter />}

                {/* AppFooter is also handled by InternalPageLayout for these routes */}
                {!location.pathname.startsWith('/devocionais') && <AppFooter />}
            </div>
        </div>
    );
};
