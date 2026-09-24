'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    createPlaylist,
    deletePlaylist,
    editPlaylist,
    getPlaylists,
} from '@/requests/protectedRequests';

import type { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError, removePlaylistFromCache } from '@/lib/utils';
import { GetPlaylistResponse } from '@/types';

type GetPlaylistsResponse =
    paths['/api/playlists/']['get']['responses'][200]['content']['application/json'];

export function usePlaylists() {
    const queryClient = useQueryClient();
    const { isAuthPending } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['playlists'],
        queryFn: getPlaylists,
        enabled: isAuthPending === false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const createPlaylistMutation = useMutation({
        mutationFn: createPlaylist,

        onSuccess: (data) => {
            queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                if (!current || !data) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        playlists: [...current.data.playlists, data.data.playlist],
                    },
                };
            });
        },
        throwOnError: (error) => {
            return !isHandledError(error, [400, 409]);
        },
    });

    const deletePlaylistMutation = useMutation({
        mutationFn: deletePlaylist,

        onError: (error, playlistId) => {
            if (hasErrorStatus(error, 404)) {
                removePlaylistFromCache(queryClient, playlistId);
            }
        },

        onSuccess: (_, playlistId) => {
            removePlaylistFromCache(queryClient, playlistId);
        },
    });

    const editPlaylistMutation = useMutation({
        mutationFn: editPlaylist,

        onSuccess: (data, { playlistId }) => {
            if (!data) return;

            const playlist = data.data.playlist;

            queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                if (!current) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        playlists: current.data.playlists.map((currentPlaylist) =>
                            currentPlaylist.id === playlistId ? playlist : currentPlaylist,
                        ),
                    },
                };
            });

            if (queryClient.getQueryData<GetPlaylistResponse>(['playlist', playlistId])) {
                queryClient.setQueryData<GetPlaylistResponse>(
                    ['playlist', playlistId],
                    (current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            data: {
                                ...current.data,
                                playlist: {
                                    ...current.data.playlist,
                                    name: playlist.name,
                                    description: playlist.description,
                                    coverUrl: playlist.coverUrl,
                                },
                            },
                        };
                    },
                );
            }
        },

        onError: (error, { playlistId }) => {
            if (hasErrorStatus(error, 404)) {
                removePlaylistFromCache(queryClient, playlistId);
            }
        },
        throwOnError: (error) => {
            return !isHandledError(error, [400, 409]);
        },
    });

    return {
        playlists: data?.data.playlists ?? [],
        isLoading,
        error,
        createPlaylistMutation,
        deletePlaylistMutation,
        editPlaylistMutation,
    };
}
