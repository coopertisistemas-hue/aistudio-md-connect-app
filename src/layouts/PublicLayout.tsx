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

            {/* Unified Glass Wrapper for Page Content + Footers */}
            <div className={!isHome ? 'surface-glass flex-1 flex flex-col min-h-[calc(100vh-80px)]' : 'flex-1 flex flex-col'}>
                {/* Main Content */}
                <main className="flex-1 w-full pb-12">
                    {/* Global Back Button (Except Home) */}
                    {!isHome && (
                        <div className="max-w-md mx-auto px-4 pt-6 pb-2 animate-in fade-in slide-in-from-left-4 duration-500">
                            <button
                                onClick={handleBack}
                                aria-label="Voltar"
                                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors border border-slate-200/50 shadow-sm active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <Outlet />
                </main>

                {/* Footers (Inside the glass wrapper) */}
                <HomeReturnPill />
                <SupportFooter />
                <AppFooter />
            </div>
        </div>
    );
};
