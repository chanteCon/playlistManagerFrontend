'use client';

import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError, removePlaylistFromCache } from '@/lib/utils';
import {
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
    editPositons,
    getPlaylist,
    patchVideo,
} from '@/requests/protectedRequests';
import { GetPlaylistsResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePlaylist(id: string) {
    const queryClient = useQueryClient();

    const { isAuthPending } = useAuth();

    const invalidatePlaylist = (playlistId: string) => {
        queryClient.invalidateQueries({
            queryKey: ['playlist', playlistId],
        });

        queryClient.invalidateQueries({
            queryKey: ['playlists'],
        });
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['playlist', id],
        queryFn: async () => {
            try {
                return await getPlaylist(id);
            } catch (error) {
                if (hasErrorStatus(error, 404)) {
                    queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                        if (!current) return current;

                        return {
                            ...current,
                            data: {
                                ...current.data,
                                playlists: current.data.playlists.filter(
                                    (playlist) => playlist.id !== id,
                                ),
                            },
                        };
                    });
                }

                throw error;
            }
        },
        enabled: isAuthPending === false,
        retry: false,
        staleTime: 5 * 60 * 1000,
        throwOnError: (error) => {
            return !isHandledError(error, [400, 409, 502]);
        },
    });

    const addVideoMutation = useMutation({
        mutationFn: addVideoToPlaylist,

        onSuccess: (_, variables) => {
            invalidatePlaylist(variables.playlistId);
        },

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                queryClient.removeQueries({
                    queryKey: ['playlist', variables.playlistId],
                });

                removePlaylistFromCache(queryClient, variables.playlistId);
            }
        },

        throwOnError: (error) => {
            return !isHandledError(error, [400, 409, 502]);
        },
    });

    const editVideoMutation = useMutation({
        mutationFn: patchVideo,

        onSuccess: (_, variables) => {
            invalidatePlaylist(variables.playlistId);
        },

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                if (error.fieldErrors['video']) {
                    invalidatePlaylist(variables.playlistId);
                }

                if (error.fieldErrors['playlist']) {
                    queryClient.removeQueries({
                        queryKey: ['playlist', variables.playlistId],
                    });

                    removePlaylistFromCache(queryClient, variables.playlistId);
                }
            }
        },

        throwOnError: (error) => {
            const playlistNotFound = hasErrorStatus(error, 404) && !!error.fieldErrors['playlist'];

            return !isHandledError(error, [400, 404]) || playlistNotFound;
        },
    });

    const deleteVideoMutation = useMutation({
        mutationFn: deleteVideoFromPlaylist,

        onSuccess: (_, variables) => {
            invalidatePlaylist(variables.playlistId);
        },

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                if (error.fieldErrors['video']) {
                    invalidatePlaylist(variables.playlistId);
                }

                if (error.fieldErrors['playlist']) {
                    queryClient.removeQueries({
                        queryKey: ['playlist', variables.playlistId],
                    });

                    removePlaylistFromCache(queryClient, variables.playlistId);
                }
            }
        },

        throwOnError: (error) => {
            const playlistNotFound = hasErrorStatus(error, 404) && !!error.fieldErrors['playlist'];

            return !isHandledError(error, [400, 404]) || playlistNotFound;
        },
    });

    const updatePositionsMutation = useMutation({
        mutationFn: editPositons,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['playlist', variables.playlistId],
            });
        },

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                if (error.fieldErrors['playlist']) {
                    queryClient.removeQueries({
                        queryKey: ['playlist', variables.playlistId],
                    });

                    removePlaylistFromCache(queryClient, variables.playlistId);
                }
            }
        },

        throwOnError: (error) => {
            const playlistNotFound = hasErrorStatus(error, 404) && !!error.fieldErrors['playlist'];

            return !isHandledError(error, [400, 404]) || playlistNotFound;
        },
    });

    return {
        playlist: data?.data.playlist,
        isLoading,
        error,
        isAuthPending,
        addVideoMutation,
        editVideoMutation,
        deleteVideoMutation,
        updatePositionsMutation,
    };
}
