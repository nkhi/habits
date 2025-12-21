import { useState, useEffect, useCallback, useRef } from 'react';
import { type WeatherMode, getAudioSrc, formatHourDisplay } from './audioConfig';

// Module-level audio element - persists across re-renders
let audioElement: HTMLAudioElement | null = null;

function getInitialPlaying(): boolean {
    return localStorage.getItem('nook-playing') === 'true';
}

function getInitialVolume(): number {
    const stored = localStorage.getItem('nook-volume');
    return stored ? parseFloat(stored) : 0.5;
}

function getInitialWeather(): WeatherMode {
    const stored = localStorage.getItem('nook-weather');
    if (stored === 'rain') return stored;
    return 'normal';
}

export function useNook() {
    const [isPlaying, setIsPlaying] = useState(getInitialPlaying);
    const [volume, setVolumeState] = useState(getInitialVolume);
    const [weatherMode, setWeatherModeState] = useState<WeatherMode>(getInitialWeather);
    const [currentHour, setCurrentHour] = useState(() => new Date().getHours());
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Track if we've initialized the audio element
    const audioInitialized = useRef(false);

    // Initialize audio element once
    useEffect(() => {
        if (!audioElement) {
            audioElement = new Audio();
            audioElement.loop = true;
        }
        audioElement.volume = volume;
        audioInitialized.current = true;
    }, []);

    // Sync volume to audio element and localStorage
    const setVolume = useCallback((newVolume: number) => {
        setVolumeState(newVolume);
        localStorage.setItem('nook-volume', String(newVolume));
        if (audioElement) {
            audioElement.volume = newVolume;
        }
    }, []);

    // Sync weather mode to localStorage
    const setWeatherMode = useCallback((mode: WeatherMode) => {
        setWeatherModeState(mode);
        localStorage.setItem('nook-weather', mode);
    }, []);

    // Toggle play/pause
    const toggle = useCallback(() => {
        setIsPlaying(prev => {
            const newState = !prev;
            localStorage.setItem('nook-playing', String(newState));
            return newState;
        });
    }, []);

    // Check for hour changes every second
    useEffect(() => {
        const interval = setInterval(() => {
            const hour = new Date().getHours();
            setCurrentHour(prev => {
                if (prev !== hour) return hour;
                return prev;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Update audio source when hour, weather, or playing state changes
    useEffect(() => {
        if (!audioElement || !audioInitialized.current) return;

        if (isPlaying) {
            const src = getAudioSrc(weatherMode, currentHour);
            if (audioElement.src !== src) {
                audioElement.src = src;
            }
            audioElement.play().catch(() => {
                // Autoplay may be blocked - user interaction required
            });
        } else {
            audioElement.pause();
        }
    }, [isPlaying, currentHour, weatherMode]);

    // Panel controls
    const openPanel = useCallback(() => setIsPanelOpen(true), []);
    const closePanel = useCallback(() => setIsPanelOpen(false), []);

    return {
        isPlaying,
        toggle,
        volume,
        setVolume,
        weatherMode,
        setWeatherMode,
        currentHour,
        currentHourDisplay: formatHourDisplay(currentHour),
        isPanelOpen,
        openPanel,
        closePanel,
    };
}
