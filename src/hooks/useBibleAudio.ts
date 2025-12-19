
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

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = rate; // Slightly slower for bible reading

        // Try to find a good voice
        const voices = synth.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt-BR') && (v.name.includes('Google') || v.name.includes('Luciana')));
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onstart = () => setState('playing');
        utterance.onpause = () => setState('paused');
        utterance.onresume = () => setState('playing');
        utterance.onend = () => {
            setState('idle');
            onEnd?.();
        };
        utterance.onerror = (e) => {
            // 'interrupted' or 'canceled' are not real errors usually
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                console.error('Speech error', e);
                setState('error');
            } else {
                setState('idle');
            }
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
        setCurrentText(text);
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
