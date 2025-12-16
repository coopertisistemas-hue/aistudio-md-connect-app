import React from 'react';

interface MobileContainerProps {
    children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
    return (
        <div className="w-full md:max-w-[430px] md:mx-auto min-h-[100dvh] bg-white shadow-2xl relative flex flex-col translate-x-0">
            {children}
        </div>
    );
}
