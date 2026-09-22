import { refresh } from '@/requests/publicRequests';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RequestError } from './apiRequest';
import type { paths } from '@/api/schema';
import type { QueryClient } from '@tanstack/react-query';
import { EditInput } from '@/types';

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

type GetPlaylistsResponse =
    paths['/api/playlists/']['get']['responses'][200]['content']['application/json'];

export const removePlaylistFromCache = (queryClient: QueryClient, playlistId: string) => {
    queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
        if (!current) return current;

        return {
            ...current,
            data: {
                ...current.data,
                playlists: current.data.playlists.filter((playlist) => playlist.id !== playlistId),
            },
        };
    });
};

export const buildPlaylistUpdates = (data: EditInput) =>
    Object.fromEntries(
        Object.entries({
            name: data.title,
            description: data.description,
        }).filter(([, value]) => value !== ''),
    );
