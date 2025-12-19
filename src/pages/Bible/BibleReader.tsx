
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Volume2 } from 'lucide-react';
import { bibleService, type BibleChapter, type BibleVerse } from '@/services/bible';
import { BibleNavigation } from '@/components/Bible/BibleNavigation';
import { VerseActionMenu } from '@/components/Bible/VerseActionMenu';
import { VerseContextModal } from '@/components/Bible/VerseContextModal';
import { BibleAudioPlayer } from '@/components/Bible/BibleAudioPlayer';
import { BackLink } from '@/components/ui/BackLink';
import { useBibleProgress } from '@/hooks/useBibleProgress';
import { useBibleAudio } from '@/hooks/useBibleAudio';
import { interactionService } from '@/services/interactionService';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function BibleReader() {
    const { bookId, chapterId } = useParams();
    const navigate = useNavigate();
    const { saveProgress } = useBibleProgress();
    const { user } = useAuth();

    // Audio Hook
    const { state: audioState, play, toggle, cancel: stopAudio, supported: audioSupported } = useBibleAudio();

    const [data, setData] = useState<BibleChapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const currentChapter = Number(chapterId);
    const displayBookName = bookId ? bibleService.expandBookName(bookId) : '';

    const [explainModal, setExplainModal] = useState<{ isOpen: boolean; verse: BibleVerse | null }>({ isOpen: false, verse: null });


    const handleExplain = (verse: BibleVerse) => {
        setExplainModal({ isOpen: true, verse });
    };

    // Load Data
    useEffect(() => {
        if (!bookId || !chapterId) return;

        // Stop audio on chapter change
        stopAudio();

        const load = async () => {
            setIsLoading(true);
            setError(false);
            window.scrollTo(0, 0); // Reset scroll on change

            try {
                const res = await bibleService.getChapter(bookId, Number(chapterId));
                if (res) {
                    setData(res);
                    // Persist Progress on successful load
                    saveProgress(bookId, Number(chapterId));
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [bookId, chapterId]);

    const handlePrev = () => {
        if (currentChapter > 1) {
            navigate(`/biblia/${bookId}/${currentChapter - 1}`);
        } else {
            // TODO: Logic to go to previous book? For now just stay or go back to book list
            navigate(`/biblia/${bookId}`);
        }
    };

    const handleNext = () => {
        // TODO: Check max chapters for book to know if we should switch book
        navigate(`/biblia/${bookId}/${currentChapter + 1}`);
    };

    // Verse Likes
    const [likedVerses, setLikedVerses] = useState<Set<string>>(new Set());
    const [verseCounts, setVerseCounts] = useState<Record<number, number>>({});

    // Load Likes functionality
    useEffect(() => {
        if (!bookId || !currentChapter) return;

        const fetchLikes = async () => {
            const stats = await interactionService.getChapterStats(bookId, currentChapter, user?.id);

            const newLiked = new Set<string>();
            const newCounts: Record<number, number> = {};

            stats.forEach(s => {
                if (s.user_has_liked) {
                    // Key format: "DisplayBook Chapter:Verse" (e.g. "João 3:16")
                    newLiked.add(`${displayBookName} ${currentChapter}:${s.verse}`);
                }
                newCounts[s.verse] = s.count;
            });

            setLikedVerses(newLiked);
            setVerseCounts(newCounts);
        };

        fetchLikes();
    }, [bookId, currentChapter, user, displayBookName]);

    const handleLikeVerse = async (verse: BibleVerse) => {
        if (!user) return;
        const verseRef = `${displayBookName} ${currentChapter}:${verse.verse}`;
        const isLiked = likedVerses.has(verseRef);

        // Optimistic UI
        const newSet = new Set(likedVerses);
        const newCounts = { ...verseCounts };
        const currentCount = newCounts[verse.verse] || 0;

        if (isLiked) {
            newSet.delete(verseRef);
            newCounts[verse.verse] = Math.max(0, currentCount - 1);
        } else {
            newSet.add(verseRef);
            newCounts[verse.verse] = currentCount + 1;
        }

        setLikedVerses(newSet);
        setVerseCounts(newCounts);

        // API Call (using bookId slug)
        const res = await interactionService.toggleVerseReaction(bookId!, currentChapter, verse.verse, user.id);

        if (!res) {
            // Revert on error
            setLikedVerses(prev => {
                const revert = new Set(prev);
                if (isLiked) revert.add(verseRef);
                else revert.delete(verseRef);
                return revert;
            });
            setVerseCounts(prev => ({
                ...prev,
                [verse.verse]: currentCount
            }));
        } else {
            // Update with accurate server count
            setVerseCounts(prev => ({
                ...prev,
                [verse.verse]: res.count
            }));
        }
    };

    const handlePlayChapter = () => {
        if (!data) return;
        // Join all text - simple approach for MVP
        // Better approach: separate by pauses, but sending one long string works for simple speech synth
        const fullText = `Capítulo ${currentChapter}. ` + data.verses.map(v => v.text).join(' ');
        play(fullText);
    };

    const handlePlayVerse = (verse: BibleVerse) => {
        const text = `Versículo ${verse.verse}. ${verse.text}`;
        play(text);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="mb-4 text-slate-400">Capítulo não encontrado.</div>
                <button
                    onClick={() => navigate(`/biblia/${bookId}`)}
                    className="text-indigo-600 font-bold"
                >
                    Voltar para {displayBookName}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Minimal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <BackLink to={`/biblia/${bookId}`} />
                    <div>
                        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{displayBookName}</h1>
                        <p className="text-xs text-slate-500">Capítulo {currentChapter}</p>
                    </div>
                </div>

                {audioSupported && (
                    <button
                        onClick={handlePlayChapter}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-colors"
                        aria-label="Ouvir Capítulo"
                    >
                        <Volume2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Reader Content */}
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="space-y-6 text-xl leading-loose text-slate-800 font-serif">
                    {data.verses.map((v) => (
                        <VerseActionMenu
                            key={v.verse}
                            verseRef={`${displayBookName} ${currentChapter}:${v.verse}`}
                            text={v.text}
                            onExplain={() => handleExplain(v)}
                            onListen={() => handlePlayVerse(v)}
                            onLike={() => handleLikeVerse(v)}
                            isLiked={likedVerses.has(`${displayBookName} ${currentChapter}:${v.verse}`)}
                            likeCount={verseCounts[v.verse]}
                        >
                            <span
                                className={cn(
                                    "inline group cursor-pointer decoration-transparent hover:decoration-indigo-200 underline decoration-2 underline-offset-4 transition-all rounded px-0.5 hover:bg-slate-50 select-none md:select-text relative",
                                    likedVerses.has(`${displayBookName} ${currentChapter}:${v.verse}`) && "decoration-red-200 hover:decoration-red-300 bg-red-50/30"
                                )}
                            >
                                <sup className="text-[10px] text-indigo-500 font-sans mr-1 font-bold opacity-60 select-none group-hover:opacity-100">{v.verse}</sup>
                                <span className={v.text.includes('Jesus') ? "text-red-800/90" : ""}>
                                    {v.text}{' '}
                                </span>
                            </span>
                        </VerseActionMenu>
                    ))}
                </div>
            </div>

            {/* Navigation Bar */}
            <BibleNavigation
                bookName={displayBookName}
                chapter={currentChapter}
                onPrev={handlePrev}
                onNext={handleNext}
                disablePrev={currentChapter <= 1}
                onMenu={() => navigate(`/biblia/${bookId}`)}
            />

            {/* Explain Modal */}
            <VerseContextModal
                isOpen={explainModal.isOpen}
                onClose={() => setExplainModal({ ...explainModal, isOpen: false })}
                verseRef={`${displayBookName} ${currentChapter}:${explainModal.verse?.verse}`}
                passageText={explainModal.verse?.text || null}
                verseBookId={bookId}
            />

            {/* Audio Player */}
            <BibleAudioPlayer
                isPlaying={audioState === 'playing'}
                isPaused={audioState === 'paused'}
                onToggle={toggle}
                onStop={stopAudio}
                bookName={displayBookName}
                chapter={currentChapter}
            />
        </div>
    );
}
