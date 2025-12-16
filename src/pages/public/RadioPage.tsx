import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon, WifiOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface RadioConfig {
    enabled: boolean;
    stream_url?: string;
    station_name?: string;
    program_name?: string;
    message?: string;
}

const RadioPage: React.FC = () => {
    const navigate = useNavigate();
    const [config, setConfig] = useState<RadioConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [error, setError] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/radio-config-public`);
            if (!res.ok) throw new Error('Failed to load config');
            const data = await res.json();
            setConfig(data);
        } catch (err) {
            console.error(err);
            // MOCK FALLBACK FOR DEMO (Since Edge Function might not be deployed)
            if (import.meta.env.DEV) {
                console.warn('Using Mock Data for Radio');
                setConfig({
                    enabled: true,
                    // Utilizando arquivo estático confiável para validação visual/UX
                    // Removido crossOrigin para evitar erro de CORS
                    stream_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                    station_name: 'Rádio IPDA (Demo Mode)',
                    program_name: 'Teste de Player',
                    message: 'Reproduzindo áudio de teste para validação do sistema.'
                });
            } else {
                toast.error('Erro ao carregar configurações da rádio');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (config?.stream_url && !audioRef.current) {
            const audio = new Audio(config.stream_url);
            // Removed crossOrigin='anonymous' to allow opaque responses (no-CORS)
            // audio.crossOrigin = 'anonymous'; 

            audio.addEventListener('playing', () => {
                setIsPlaying(true);
                setError(false);
            });

            audio.addEventListener('pause', () => setIsPlaying(false));

            audio.addEventListener('error', (e) => {
                console.error('Stream error:', e);
                setIsPlaying(false);
                setError(true);
                toast.error('Erro na transmissão. Tentando reconectar...');
            });

            audioRef.current = audio;
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [config]);

    const togglePlay = () => {
        if (!audioRef.current || !config?.stream_url) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            setError(false);
            audioRef.current.play().catch(err => {
                console.error('Play error:', err);
                setError(true);
                toast.error('Não foi possível iniciar a reprodução');
            });
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
                <p className="text-slate-500 font-medium">Sintonizando...</p>
            </div>
        );
    }

    if (!config?.enabled || !config?.stream_url) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <RadioIcon className="w-10 h-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-900">Rádio Offline</h2>
                    <p className="text-slate-500 max-w-xs mx-auto">
                        A rádio não está transmitindo no momento. Verifique a programação ou tente novamente mais tarde.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/home')}>Voltar ao Início</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 bg-gradient-to-b from-purple-50 via-white to-white flex flex-col items-center animate-in fade-in duration-500">
            {/* Header / Meta */}
            <div className="w-full max-w-md space-y-8 text-center mt-4 relative flex-1 flex flex-col items-center justify-center">
                {/* Back Button - Floating Top Left relative to content */}
                <div className="absolute left-0 top-0 w-full flex justify-start -translate-y-12">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-slate-900"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </div>

                <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-red-400/50'}`} />
                        {isPlaying ? 'Ao Vivo' : 'No Ar'}
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        {config.station_name || 'Rádio IPDA'}
                    </h1>
                    <p className="text-purple-600 font-medium text-lg">
                        {config.program_name || 'Programação Especial'}
                    </p>
                </div>

                {/* Cover Art / Visualizer Placeholder */}
                <div className="relative w-72 h-72 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/50">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478737270239-2f52b7154e7a?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-overlay" />
                    <RadioIcon className="w-24 h-24 text-white/90 drop-shadow-xl" strokeWidth={1.5} />

                    {/* Animated Rings if Playing */}
                    {isPlaying && (
                        <>
                            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping opacity-20" />
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full animate-ping delay-300 opacity-20" />
                        </>
                    )}
                </div>

                {/* Message */}
                {config.message && (
                    <p className="text-slate-500 font-medium italic px-6">"{config.message}"</p>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <WifiOff className="w-4 h-4" />
                        Sinal instável. Verifique sua conexão.
                    </div>
                )}
            </div>

            {/* Controls - Pushed to bottom via mt-auto, no longer fixed overlapping nav */}
            <div className="w-full max-w-md mt-auto pt-8 pb-4">
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-4 border border-white/60 shadow-lg flex items-center justify-between gap-6 px-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 h-10 w-10"
                    >
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>

                    <Button
                        size="icon"
                        className={`
                            h-16 w-16 rounded-full shadow-xl shadow-purple-200 transition-all hover:scale-105 active:scale-95
                            ${isPlaying ? 'bg-white border-4 border-purple-50 text-purple-600' : 'bg-purple-600 text-white'}
                        `}
                        onClick={togglePlay}
                    >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current translate-x-1" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-300 hover:text-purple-600 hover:bg-purple-50 h-10 w-10"
                        disabled
                    >
                        <RadioIcon className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RadioPage;
