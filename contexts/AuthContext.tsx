'use client';

import { initializeAuth } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextValue = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
    isAuthPending: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { mutate, isPending } = useMutation({
        mutationFn: initializeAuth,

        onSuccess: (res) => {
            setAccessToken(res.data.accessToken);
        },
    });

    useEffect(() => {
        mutate();
    }, [mutate]);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    function clearAccessToken() {
        setAccessToken(null);
    }

    return (
        <AuthContext.Provider
            value={{ accessToken, setAccessToken, clearAccessToken, isAuthPending: isPending }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('Auth context error, must be used inside AuthProvider');
    }
    return context;
}
