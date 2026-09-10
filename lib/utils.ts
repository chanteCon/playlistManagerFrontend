import { refresh } from '@/requests/publicRequests';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RequestError } from './apiRequest';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type AuthResponse = {
    data: {
        accessToken: string;
    };
};
export const extractAccessToken = (res: AuthResponse) => {
    if (!res.data || !res.data.accessToken) {
        throw new Error('Authentication response did not contain an access token');
    }

    return res.data.accessToken;
};

let refreshPromise: ReturnType<typeof refresh> | null = null;

export const refreshOnce = () => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = refresh().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};

let authInitPromise: ReturnType<typeof refresh> | null = null;

export const initializeAuth = () => {
    if (!authInitPromise) {
        authInitPromise = refreshOnce();
    }

    return authInitPromise;
};

export const isRequestError = (error: unknown): error is RequestError => {
    return error instanceof RequestError;
};

export const isHandledError = (error: unknown, statuses: number[]): error is RequestError => {
    return isRequestError(error) && statuses.includes(error.status);
};

export const hasErrorStatus = (error: unknown, status: number): error is RequestError => {
    return isRequestError(error) && error.status === status;
};
