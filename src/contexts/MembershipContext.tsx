import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useChurch } from './ChurchContext';

export type MemberStatus = 'loading' | 'active' | 'pending' | 'blocked' | 'afastado' | 'visitante' | 'guest' | 'no_record';

interface Member {
    id: string;
    full_name: string;
    nickname?: string;
    phone?: string;
    email?: string;
    birth_date?: string;
    photo_url?: string;
    status: string;
    role?: string;
    user_id?: string;
    privacy_settings?: {
        show_phone: boolean;
        show_email: boolean;
        show_birth: boolean;
        show_address: boolean;
    };
}

interface MembershipContextType {
    member: Member | null;
    status: MemberStatus;
    isLoading: boolean;
    refreshMember: () => Promise<void>;
    joinChurch: (data: Partial<Member>) => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType>({
    member: null,
    status: 'loading',
    isLoading: true,
    refreshMember: async () => { },
    joinChurch: async () => { },
});

export const useMembership = () => useContext(MembershipContext);

export function MembershipProvider({ children }: { children: React.ReactNode }) {
    const { church } = useChurch();
    const [member, setMember] = useState<Member | null>(null);
    const [status, setStatus] = useState<MemberStatus>('loading');
    const [isLoading, setIsLoading] = useState(true);

    const loadMember = async () => {
        if (!church) {
            setStatus('loading');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Get Current User
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.user) {
                setStatus('guest');
                setMember(null);
                return;
            }

            // 2. Check Member Record for this Church
            const { data } = await supabase
                .from('members')
                .select('*')
                .eq('church_id', church.id)
                .eq('user_id', session.user.id)
                .single();

            if (data) {
                setMember(data);
                setStatus(data.status as MemberStatus);
            } else {
                setMember(null);
                setStatus('no_record');
            }

        } catch (error) {
            console.error('Error loading membership:', error);
            setStatus('guest'); // Default to guest on error? Or error state?
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMember();
    }, [church]);

    const joinChurch = async (memberData: Partial<Member>) => {
        if (!church) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('members')
            .insert({
                ...memberData,
                church_id: church.id,
                user_id: session.user.id,
                status: 'pendente', // Always start as pending
                email: session.user.email, // Default to auth email
            });

        if (error) throw error;
        await loadMember();
    };

    return (
        <MembershipContext.Provider value={{ member, status, isLoading, refreshMember: loadMember, joinChurch }}>
            {children}
        </MembershipContext.Provider>
    );
}
