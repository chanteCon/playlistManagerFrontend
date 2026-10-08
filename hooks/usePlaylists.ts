'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
    createPlaylist,
    deletePlaylist,
    editPlaylist,
    getPlaylists,
} from '@/requests/protectedRequests';

import { useAuth } from '@/contexts/AuthContext';
import {
    hasErrorStatus,
    isHandledError,
    markPlaylistInteracted,
    removePlaylistFromCache,
} from '@/lib/utils';

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
            queryClient.invalidateQueries({
                queryKey: ['playlists'],
            });
            markPlaylistInteracted(data!.data.playlist.id);
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
            queryClient.removeQueries({
                queryKey: ['playlist', playlistId],
            });

            queryClient.invalidateQueries({
                queryKey: ['playlists'],
            });

            queryClient.invalidateQueries({ queryKey: ['collection'] });
        },
    });

    const editPlaylistMutation = useMutation({
        mutationFn: editPlaylist,

        onSuccess: (_, { playlistId }) => {
            queryClient.invalidateQueries({
                queryKey: ['playlists'],
            });

            queryClient.invalidateQueries({
                queryKey: ['playlist', playlistId],
            });
            queryClient.invalidateQueries({ queryKey: ['collection'] });
            markPlaylistInteracted(playlistId);
        },

        onError: (error, { playlistId }) => {
            if (hasErrorStatus(error, 404)) {
                queryClient.removeQueries({
                    queryKey: ['playlist', playlistId],
                });

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
