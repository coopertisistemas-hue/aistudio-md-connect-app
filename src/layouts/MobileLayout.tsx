import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/ui/BottomNav';

export function MobileLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">

            {/* Main Content Area - Native Scroll */}
            <main className="flex-1 pb-24">
                <Outlet />
            </main>

            {/* Bottom Navigation - Fixed */}
            <BottomNav />
        </div>
    );
}
