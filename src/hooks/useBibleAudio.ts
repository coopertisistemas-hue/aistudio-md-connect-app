
import { useState, useEffect, useRef, useCallback } from 'react';

type AudioState = 'idle' | 'playing' | 'paused' | 'error';

interface UseBibleAudioProps {
    onEnd?: () => void;
}

export function useBibleAudio({ onEnd }: UseBibleAudioProps = {}) {
    const [state, setState] = useState<AudioState>('idle');

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const synth = window.speechSynthesis;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancel();
        };
    }, []);

    const cancel = useCallback(() => {
        if (synth) {
            synth.cancel();
        }
        setState('idle');
    }, [synth]);

    const play = useCallback((text: string, rate: number = 0.9) => {
        if (!synth) {
            console.warn('Speech Synthesis not supported');
            setState('error');
            return;
        }

        // Stop previous
        synth.cancel();

        // Initialize utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = rate;
        utterance.pitch = 1.0;

        // Smart Voice Selection
        const voices = synth.getVoices();
        const ptVoices = voices.filter(v => v.lang.startsWith('pt-BR') || v.lang === 'pt_BR');

        // Priority: Google -> Microsoft (Francisca/Antonio) -> Any Microsoft -> Any PT
        let selectedVoice = ptVoices.find(v => v.name.includes('Google') && v.name.includes('Português'));

        if (!selectedVoice) {
            selectedVoice = ptVoices.find(v => v.name.includes('Francisca') || v.name.includes('Antonio'));
        }

        if (!selectedVoice) {
            selectedVoice = ptVoices.find(v => v.name.includes('Microsoft'));
        }

        if (!selectedVoice) {
            selectedVoice = ptVoices[0];
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onstart = () => setState('playing');
        utterance.onpause = () => setState('paused');
        utterance.onresume = () => setState('playing');
        utterance.onend = () => {
            setState('idle');
            onEnd?.();
        };
        utterance.onerror = (e) => {
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.error('Speech error', e);
                setState('error');
            } else {
                setState('idle');
            }
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);

    }, [synth, onEnd]);

    const pause = useCallback(() => {
        if (synth && synth.speaking) {
            synth.pause();
            setState('paused');
        }
    }, [synth]);

    const resume = useCallback(() => {
        if (synth && synth.paused) {
            synth.resume();
            setState('playing');
        }
    }, [synth]);

    const toggle = useCallback(() => {
        if (state === 'playing') pause();
        else if (state === 'paused') resume();
    }, [state, pause, resume]);

    return {
        state,
        play,
        pause,
        resume,
        cancel,
        toggle,
        supported: !!window.speechSynthesis
    };
}
