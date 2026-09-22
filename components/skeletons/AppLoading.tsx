'use client';

import { Library } from 'lucide-react';
import { useEffect, useState } from 'react';

const messages = [
    'Loading your playlists',
    'Starting demo',
    'Getting everything ready, this may take up to a minute on first load',
    'Almost there',
];

export default function AppLoading() {
    const [messageIndex, setMessageIndex] = useState(0);
    const [dots, setDots] = useState('.');

    useEffect(() => {
        const messageTimer = setInterval(() => {
            setMessageIndex((current) => (current + 1) % messages.length);
        }, 4000);

        const dotsTimer = setInterval(() => {
            setDots((current) => {
                if (current === '.') return '..';
                if (current === '..') return '...';
                return '.';
            });
        }, 700);

        return () => {
            clearInterval(messageTimer);
            clearInterval(dotsTimer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4 text-center">
                <Library className="size-10 animate-pulse text-primary" />

                <p className="text-sm text-muted-foreground" aria-live="polite">
                    {messages[messageIndex]}
                    <span className="inline-block w-5 text-left">{dots}</span>
                </p>
            </div>
        </div>
    );
}
