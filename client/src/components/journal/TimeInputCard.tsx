import { useRef } from 'react';
import { Sun, Moon } from '@phosphor-icons/react';
import styles from './Diary.module.css';

interface TimeInputCardProps {
    questionText: string;
    value: string; // ISO datetime string or empty
    onChange: (isoDateTime: string) => void;
    type: 'wake' | 'sleep';
}

export function TimeInputCard({ questionText, value, onChange, type }: TimeInputCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    // Format ISO string to display as HH:MM AM/PM
    const formatDisplayTime = (isoString: string): string => {
        if (!isoString) return '--:--';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return '--:--';
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return '--:--';
        }
    };

    // Convert ISO string to datetime-local input format (YYYY-MM-DDTHH:MM)
    const toDatetimeLocalValue = (isoString: string): string => {
        if (!isoString) return '';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return '';
            // Format as local datetime string for the input
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const localDateTime = e.target.value;
        if (!localDateTime) return;

        // Convert datetime-local value to ISO string
        const date = new Date(localDateTime);
        if (!isNaN(date.getTime())) {
            onChange(date.toISOString());
        }
    };

    const handleCardClick = () => {
        // Trigger the hidden datetime picker
        inputRef.current?.showPicker?.();
        inputRef.current?.focus();
    };

    const hasValue = !!value;
    const Icon = type === 'wake' ? Sun : Moon;
    const iconColor = hasValue ? (type === 'wake' ? '#FFD93D' : '#A78BFA') : 'rgba(255, 255, 255, 0.4)';
    const displayTime = formatDisplayTime(value);

    return (
        <div className={styles.timeInputCard} onClick={handleCardClick}>
            <div className={styles.timeInputHeader}>
                <Icon size={20} weight={hasValue ? 'duotone' : 'regular'} color={iconColor} />
                <span className={styles.timeInputLabel}>{questionText}</span>
            </div>
            <div className={styles.timeInputDisplay}>
                <span className={styles.timeInputValue}>{displayTime}</span>
            </div>
            {/* Hidden datetime-local input */}
            <input
                ref={inputRef}
                type="datetime-local"
                value={toDatetimeLocalValue(value)}
                onChange={handleInputChange}
                className={styles.timeInputHidden}
            />
        </div>
    );
}
