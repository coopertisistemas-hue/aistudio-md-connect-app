import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { churchService, type Church } from '@/services/church';

interface ChurchContextType {
    church: Church | null;
    isLoading: boolean;
    error: string | null;
}

const ChurchContext = createContext<ChurchContextType>({
    church: null,
    isLoading: true,
    error: null
});

export const useChurch = () => useContext(ChurchContext);

export function ChurchProvider({ children }: { children: React.ReactNode }) {
    const { slug } = useParams<{ slug: string }>();
    const [church, setChurch] = useState<Church | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setIsLoading(false);
            return;
        }

        const loadChurch = async () => {
            setIsLoading(true);
            try {
                const data = await churchService.getBySlug(slug);
                if (data) {
                    setChurch(data);
                    localStorage.setItem('md_current_church', JSON.stringify(data));
                } else {
                    setError('Igreja não encontrada');
                    setChurch(null);
                }
            } catch (err) {
                console.error(err);
                setError('Erro ao carregar igreja');
            } finally {
                setIsLoading(false);
            }
        };

        loadChurch();
    }, [slug]);

    if (!slug) {
        // Should technically not happen if grounded in /c/:slug
        return <>{children}</>;
    }

    return (
        <ChurchContext.Provider value={{ church, isLoading, error }}>
            {children}
        </ChurchContext.Provider>
    );
}
