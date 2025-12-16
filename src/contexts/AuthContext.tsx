import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                // Fetch enriched profile from Edge Function
                supabase.functions.invoke('auth-me').then(({ data, error }) => {
                    if (!error && data) {
                        // We could store the full enriched profile here if we extended the Context type.
                        // For now, ensuring we have the user and maybe setting a local storage cache or similar.
                        // Actually, just confirming we can reach the user data.
                        // We stick to setting the basic user for now to avoid breaking types, 
                        // but ideally we should update the Context to hold 'profile' and 'church'.
                        setUser(session.user);
                    } else {
                        // Fallback or just set user
                        setUser(session.user);
                    }
                    setLoading(false);
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
