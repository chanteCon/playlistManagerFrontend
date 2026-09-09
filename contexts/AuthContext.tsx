'use client';

import { registerAuthHandler } from '@/lib/apiRequest';
import { initializeAuth } from '@/lib/utils';
import { middlewareAuthHandler } from '@/requests/authMiddleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type AuthContextValue = {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
    isAuthPending: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [isAuthPending, setIsAuthPending] = useState(true);
    const { mutate } = useMutation({
        mutationFn: initializeAuth,

        onSuccess: (res) => {
            setAccessToken(res.data.accessToken);
            setIsAuthPending(false);
        },
        onError: () => {
            setIsAuthPending(false);
        },
    });

    useEffect(() => {
        mutate();
    }, [mutate]);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const clearAccessToken = useCallback(() => {
        setAccessToken(null);
        queryClient.clear();
    }, [queryClient]);

    useEffect(() => {
        registerAuthHandler({
            clearAccessToken,
            setAccessToken,
        });

        middlewareAuthHandler({
            getAccessToken: () => accessToken,
        });
    }, [accessToken, clearAccessToken]);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                setAccessToken,
                clearAccessToken,
                isAuthPending,
            }}
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
