import { useEffect, useState } from 'react';

export function AppBackground() {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // Global Video Style: All pages now share the same 'Home' glass/video style
    const isHome = true;

    useEffect(() => {
        // Check OS preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const updatePreference = () => {
            // Check LocalStorage override OR OS preference
            const stored = localStorage.getItem('md_reduce_motion');
            const prefersReduced = mediaQuery.matches;

            if (stored === 'true') {
                setReduceMotion(true);
            } else if (stored === 'false') {
                setReduceMotion(false);
            } else {
                setReduceMotion(prefersReduced);
            }
        };

        updatePreference();
        mediaQuery.addEventListener('change', updatePreference);

        // Listen for custom event to toggle (optional mechanism)
        window.addEventListener('md-toggle-motion', updatePreference);

        return () => {
            mediaQuery.removeEventListener('change', updatePreference);
            window.removeEventListener('md-toggle-motion', updatePreference);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[-10] bg-[#F6F7FB] overflow-hidden pointer-events-none select-none">

            {/* 1. Video Layer */}
            {!reduceMotion && (
                <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Added Blur Wrapper for Video Legibility - Stronger on internal pages */}
                    <div className={`absolute inset-0 z-[1] transition-all duration-700 ${isHome ? 'backdrop-blur-[3px]' : 'backdrop-blur-[12px] bg-white/20'}`} />

                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setVideoLoaded(true)}
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/md-bg.mp4?v=1" type="video/mp4" />
                    </video>
                </div>
            )}

            {/* 2. Scrim Layer (Legibility Gradient) */}
            {/* Top: Light/White for Header readability */}
            {/* Middle: Transparent/Neutral */}
            {/* Bottom: Darker/Tinted for Footer readability */}
            <div className={`absolute inset-0 z-[2] pointer-events-none mix-blend-normal transition-opacity duration-700 ${isHome ? 'opacity-100' : 'opacity-90'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/35 to-white/20" />
            </div>

            {/* Additional Scrim for Contrast (Bottom-heavy) */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-slate-900/10 via-transparent to-white/40" />

            {/* Internal Pages Extra Overlay for max legibility */}
            {!isHome && (
                <div className="absolute inset-0 z-[2] bg-slate-50/60 mix-blend-overlay transition-opacity duration-700" />
            )}

            {/* 3. Noise Texture (Subtle Premium Feel) */}
            <div className="absolute inset-0 z-[3] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] brightness-100 contrast-150 mix-blend-multiply"></div>

            {/* 4. Fallback Gradient (Visible if video disabled or loading) */}
            {(reduceMotion || !videoLoaded) && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 -z-10" />
            )}

        </div>
    );
}
