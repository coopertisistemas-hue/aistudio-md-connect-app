import React from 'react';
import { useMembership } from '@/contexts/MembershipContext';
import { PendingApproval, AccessDenied, NotAMember, GuestLogin } from '@/pages/status/GateScreens';
import { Loader2 } from 'lucide-react';

export function MembershipGate({ children }: { children: React.ReactNode }) {
    const { status, isLoading } = useMembership();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    switch (status) {
        case 'active':
            return <>{children}</>;
        case 'pending':
            return <PendingApproval />;
        case 'blocked':
        case 'afastado': // Treat afastado similar to blocked or read-only? Prompt says "blocked não entra". Afastado usually implies blocked too or limited. treating as blocked for now.
            return <AccessDenied />;
        case 'no_record':
            return <NotAMember />;
        case 'guest':
            return <GuestLogin />;
        default:
            return <GuestLogin />;
    }
}
