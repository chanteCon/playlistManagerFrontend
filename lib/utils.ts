import { refresh } from '@/requests/publicRequests';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RequestError } from './apiRequest';
import type { paths } from '@/api/schema';
import type { QueryClient } from '@tanstack/react-query';
import { EditInput, GetCollectionResponse, GetCollectionsResponse } from '@/types';

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

    queryClient.removeQueries({
        queryKey: ['playlist', playlistId],
    });
};

export const buildPlaylistUpdates = (data: EditInput) => ({
    name: data.title,
    description: data.description,
});

export function mapPlaylistFieldErrors(
    fieldErrors: Record<string, string>,
): Record<string, string> {
    const errors = { ...fieldErrors };

    if (errors.name) {
        errors.title = errors.name;
        delete errors.name;
    }

    return errors;
}

export const removeCollectionFromCache = (queryClient: QueryClient, collectionId: string) => {
    queryClient.setQueryData<GetCollectionsResponse>(['collections'], (current) => {
        if (!current) return current;

        return {
            ...current,
            data: {
                ...current.data,
                collections: current.data.collections.filter(
                    (collection) => collection.id !== collectionId,
                ),
            },
        };
    });

    queryClient.removeQueries({
        queryKey: ['collection', collectionId],
    });
};

const PLAYLIST_LAST_OPENED_KEY = 'playlist-last-opened';
const COLLECTION_LAST_OPENED_KEY = 'collection-last-opened';

type LastOpenedMap = Record<string, string>;

function getLastOpened(key: string): LastOpenedMap {
    try {
        return JSON.parse(localStorage.getItem(key) ?? '{}');
    } catch {
        return {};
    }
}

export function markPlaylistOpened(id: string) {
    const opened = getLastOpened(PLAYLIST_LAST_OPENED_KEY);

    localStorage.setItem(
        PLAYLIST_LAST_OPENED_KEY,
        JSON.stringify({
            ...opened,
            [id]: new Date().toISOString(),
        }),
    );
}

export function markCollectionOpened(id: string) {
    const opened = getLastOpened(COLLECTION_LAST_OPENED_KEY);

    localStorage.setItem(
        COLLECTION_LAST_OPENED_KEY,
        JSON.stringify({
            ...opened,
            [id]: new Date().toISOString(),
        }),
    );
}

export function sortByRecentActivity<T extends { id: string; updatedAt: string }>(
    items: T[],
    storageKey: string,
) {
    const lastOpened = getLastOpened(storageKey);

    return [...items].sort((a, b) => {
        const aOpened = lastOpened[a.id];
        const bOpened = lastOpened[b.id];

        if (aOpened && bOpened) {
            return bOpened.localeCompare(aOpened);
        }

        if (aOpened) return -1;

        if (bOpened) return 1;

        return b.updatedAt.localeCompare(a.updatedAt);
    });
}
