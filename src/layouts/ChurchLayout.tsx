import { lazy, Suspense } from 'react';
import { ChurchProvider, useChurch } from '@/contexts/ChurchContext';
import ChurchNotFound from '@/pages/ChurchNotFound';
import { MobileLayout } from '@/layouts/MobileLayout';
import { Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { MembershipProvider } from '@/contexts/MembershipContext';
import { MembershipGate } from '@/components/auth/MembershipGate';
const ChurchShowcase = lazy(() => import('@/pages/ChurchShowcase'));
import { AppBackground } from '@/components/layout/AppBackground';

function ChurchLayoutContent() {
    const { church, isLoading, error } = useChurch();
    const { user, loading: authLoading } = useAuth();

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !church) {
        return <ChurchNotFound />;
    }

    // Unauthenticated -> Show Showcase
    if (!user) {
        return (
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>}>
                <ChurchShowcase />
            </Suspense>
        );
    }

    // Authenticated -> Show Full App (Wrapped in Membership Context & Gate)
    return (
        <MembershipProvider>
            <MembershipGate>
                <MobileLayout />
            </MembershipGate>
        </MembershipProvider>
    );
}

export function ChurchLayout() {
    return (
        <>
            <AppBackground />
            <ChurchProvider>
                <ChurchLayoutContent />
            </ChurchProvider>
        </>
    );
}
