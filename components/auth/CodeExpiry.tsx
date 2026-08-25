'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const CODE_EXPIRY = 5 * 60;

export default function CodeExpiry() {
    const [secondsLeft, setSecondsLeft] = useState(CODE_EXPIRY);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setSecondsLeft((current) => current - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return (
        <>
            <p
                className={`text-center text-sm ${
                    secondsLeft > 0 && secondsLeft <= 30
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                }`}
            >
                {secondsLeft === 0
                    ? 'Code expired. Request new code to continue.'
                    : `Code expires in about ${formattedTime}`}
            </p>
        </>
    );
}
