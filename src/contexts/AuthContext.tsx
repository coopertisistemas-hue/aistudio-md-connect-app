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
                supabase.functions.invoke('auth-me')
                    .then(({ data, error }) => {
                        if (!error && data) {
                            setUser(session.user);
                        } else {
                            // Fallback to basic session user if auth-me fails (e.g. 401, 500)
                            console.warn('Auth-me check failed, falling back to basic session:', error?.message || 'Unknown error');
                            setUser(session.user);
                        }
                    })
                    .catch(err => {
                        console.error('Unexpected error during auth-me:', err);
                        setUser(session.user); // Fallback
                    })
                    .finally(() => {
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
