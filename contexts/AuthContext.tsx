'use client';

import { registerAuthHandler } from '@/lib/apiRequest';
import { initializeAuth } from '@/lib/utils';
import { middlewareAuthHandler } from '@/requests/authMiddleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

type AuthContextValue = {
    accessToken: string | null;
    updateAccessToken: (token: string) => void;
    clearAccessToken: () => void;
    isAuthPending: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const accessTokenRef = useRef<string | null>(null);
    const queryClient = useQueryClient();
    const [isAuthPending, setIsAuthPending] = useState(true);
    const { mutate } = useMutation({
        mutationFn: initializeAuth,

        onSuccess: (res) => {
            updateAccessToken(res.data.accessToken);
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

    const updateAccessToken = useCallback((token: string | null) => {
        accessTokenRef.current = token;
        setAccessToken(token);
    }, []);

    const clearAccessToken = useCallback(() => {
        updateAccessToken(null);
        queryClient.clear();
    }, [queryClient, updateAccessToken]);

    useEffect(() => {
        registerAuthHandler({
            clearAccessToken,
            updateAccessToken,
        });

        middlewareAuthHandler({
            getAccessToken: () => accessTokenRef.current,
        });
    }, [updateAccessToken, clearAccessToken]);
    return (
        <AuthContext.Provider
            value={{
                accessToken,
                updateAccessToken,
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
