'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { accessToken, isAuthPending } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!isAuthPending && accessToken) {
            router.replace('/dashboard');
        }
    }, [accessToken, router, isAuthPending]);

    if (isAuthPending || accessToken) {
        return null;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="flex w-full max-w-md flex-col items-center gap-6">{children}</div>
        </main>
    );
}
