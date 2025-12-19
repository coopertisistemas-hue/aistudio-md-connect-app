
import { useState, useEffect } from 'react';

export interface BibleProgress {
    book: string;
    chapter: number;
    lastReadAt: string; // ISO Date
}

const STORAGE_KEY = 'md_bible_progress';

export function useBibleProgress() {
    const [progress, setProgress] = useState<BibleProgress | null>(null);

    // Load on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProgress(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse bible progress", e);
            }
        }
    }, []);

    const saveProgress = (book: string, chapter: number) => {
        const newProgress: BibleProgress = {
            book,
            chapter,
            lastReadAt: new Date().toISOString()
        };
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));

        // TODO: Sync to Supabase if user is logged in
    };

    return {
        progress,
        saveProgress
    };
}
