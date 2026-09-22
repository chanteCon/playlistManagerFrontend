'use client';

import { useAuth } from '@/contexts/AuthContext';
import AppLoading from '@/components/skeletons/AppLoading';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { isAuthPending } = useAuth();

    if (isAuthPending) {
        return <AppLoading />;
    }

    return children;
}
