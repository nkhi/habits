import { useState, useEffect } from 'react';
import styles from './ServerStatus.module.css';

export const ServerStatus = ({ apiBaseUrl }: { apiBaseUrl: string }) => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null); // null = initial check

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`${apiBaseUrl}/health`);
                if (res.ok) {
                    setIsOnline(true);
                } else {
                    setIsOnline(false);
                }
            } catch (e) {
                setIsOnline(false);
            }
        };

        // Check immediately
        checkStatus();

        // Then every 2 seconds
        const interval = setInterval(checkStatus, 2000);

        return () => clearInterval(interval);
    }, [apiBaseUrl]);

    // Only show when definitely offline
    if (isOnline !== false) {
        return null;
    }

    return (
        <div className={styles.container} title="Server Offline (Reconnecting...)">
            <div className={styles.indicator} />
        </div>
    );
};
