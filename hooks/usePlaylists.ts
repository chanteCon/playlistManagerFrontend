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
import { hasErrorStatus, removePlaylistFromCache } from '@/lib/utils';

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
            queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                if (!current || !data) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        playlists: current.data.playlists.map((playlist) =>
                            playlist.id === playlistId ? data.data.playlist : playlist,
                        ),
                    },
                };
            });
        },

        onError: (error, { playlistId }) => {
            if (hasErrorStatus(error, 404)) {
                removePlaylistFromCache(queryClient, playlistId);
            }
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
