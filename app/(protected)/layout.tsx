'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { accessToken, isAuthPending } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthPending && !accessToken) {
            router.replace('/login');
        }
    }, [accessToken, router, isAuthPending]);

    if (isAuthPending || !accessToken) {
        return null;
    }

    return children;
}
