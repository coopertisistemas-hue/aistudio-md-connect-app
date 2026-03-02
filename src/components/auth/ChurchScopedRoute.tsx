import { useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export function ChurchScopedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isAllowed, setIsAllowed] = useState(false);
    // const [userChurchSlug, setUserChurchSlug] = useState<string | null>(null);

    useEffect(() => {
        const checkAccess = async () => {
            if (!user) {
                // Should be caught by ProtectedRoute, but double check
                setLoading(false);
                return;
            }

            try {
                // 1. Get Profile's Church ID
                // Ideally use Edge Function if strict "no db access" required.
                // For now, simple read is standard, but let's try to be compliant if possible.
                // 'public-church-detail' doesn't help with *my* profile.
                // START HACK: Using direct DB for profile (standard practice even in BFF usually for Auth)
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('church_id')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profile?.church_id) {
                    // No church linked -> Redirect to Onboarding
                    navigate('/onboarding/select-church');
                    return;
                }

                // 2. Get User's Church Slug
                const { data: church, error: churchError } = await supabase
                    .from('churches')
                    .select('slug')
                    .eq('id', profile.church_id)
                    .single();

                if (churchError || !church) {
                    // Church possibly deleted? Back to onboarding
                    navigate('/onboarding/select-church');
                    return;
                }

                // setUserChurchSlug(church.slug);

                // 3. Validation
                // Is this the correct slug?
                if (slug === church.slug) {
                    // Track onboarding_complete on first successful church access
                    const hasCompletedOnboarding = localStorage.getItem('mdc_onboarding_complete');
                    if (!hasCompletedOnboarding) {
                        analytics.trackEvent('onboarding_complete', { church_id: profile.church_id }, 'member');
                        localStorage.setItem('mdc_onboarding_complete', 'true');
                    }
                    setIsAllowed(true);
                } else {
                    // Mismatch. 
                    // Are they Admin? (TODO: Check role)
                    // For now, strict block for normal members.
                    console.warn(`Redirecting from ${slug} to ${church.slug}`);
                    navigate(`/c/${church.slug}`, { replace: true });
                }

            } catch (err) {
                console.error('Auth Guard Error:', err);
                navigate('/home');
            } finally {
                setLoading(false);
            }
        };

        checkAccess();
    }, [user, slug, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/home" replace />;

    // If we are here and not allowed, the effect should have redirected. 
    // But rendering children only if explicitly allowed avoids flash of content.
    return isAllowed ? <>{children}</> : null;
}
