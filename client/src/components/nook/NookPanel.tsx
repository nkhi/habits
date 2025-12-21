import { useEffect, useRef } from 'react';
import { Leaf } from '@phosphor-icons/react';
import type { WeatherMode } from './audioConfig';
import styles from './Nook.module.css';

interface NookPanelProps {
    currentHour: number;
    currentHourDisplay: string;
    volume: number;
    setVolume: (v: number) => void;
    weatherMode: WeatherMode;
    setWeatherMode: (m: WeatherMode) => void;
    onClose: () => void;
}

// Time-based colors: orange morning, blue day, purple night
function getTimeColors(hour: number): { text: string; bg: string } {
    if (hour >= 5 && hour < 12) {
        // Morning: orange
        return { text: '#f5a623', bg: 'rgba(245, 166, 35, 0.15)' };
    }
    if (hour >= 12 && hour < 19) {
        // Day: blue
        return { text: '#4a9eff', bg: 'rgba(74, 158, 255, 0.15)' };
    }
    // Night: purple
    return { text: '#b366ff', bg: 'rgba(179, 102, 255, 0.15)' };
}

export function NookPanel({
    currentHour,
    currentHourDisplay,
    volume,
    setVolume,
    weatherMode,
    setWeatherMode,
    onClose,
}: NookPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const timeColors = getTimeColors(currentHour);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        }
        // Delay adding listener to avoid immediate close from the triggering click
        const timeout = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        return () => {
            clearTimeout(timeout);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Close on Escape
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div ref={panelRef} className={styles.panel}>
            <div className={styles.header}>
                <span className={styles.title}>
                    <Leaf size={16} weight="duotone" />
                    Nook
                </span>
                <span
                    className={styles.timeIndicator}
                    style={{ color: timeColors.text, backgroundColor: timeColors.bg }}
                >
                    {currentHourDisplay}
                </span>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Weather</label>
                <select
                    className={styles.select}
                    value={weatherMode}
                    onChange={(e) => setWeatherMode(e.target.value as WeatherMode)}
                >
                    <option value="normal">Normal</option>
                    <option value="rain">Rain</option>
                </select>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Volume</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className={styles.slider}
                />
            </div>
        </div>
    );
}
