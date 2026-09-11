'use client';
import { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError, removePlaylistFromCache } from '@/lib/utils';
import {
    addVideoToPlaylist,
    deleteVideoFromPlaylist,
    getPlaylist,
    patchVideo,
} from '@/requests/protectedRequests';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type GetPlaylistResponse =
    paths['/api/playlists/{id}']['get']['responses'][200]['content']['application/json'];

export function usePlaylist(id: string) {
    const queryClient = useQueryClient();

    const removeVideoFromCache = (playlistId: string, videoId: string) => {
        queryClient.setQueryData<GetPlaylistResponse>(['playlist', playlistId], (current) => {
            if (!current) return current;

            return {
                ...current,
                data: {
                    ...current.data,
                    playlist: {
                        ...current.data.playlist,
                        videos: current.data.playlist.videos.filter(
                            (video) => video.id !== videoId,
                        ),
                    },
                },
            };
        });
    };

    const { isAuthPending } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['playlist', id],
        queryFn: async () => {
            try {
                return await getPlaylist(id);
            } catch (error) {
                if (hasErrorStatus(error, 404)) {
                    removePlaylistFromCache(queryClient, id);
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

        onSuccess: (data, variables) => {
            queryClient.setQueryData<GetPlaylistResponse>(
                ['playlist', variables.playlistId],
                (current) => {
                    if (!current || !data) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            playlist: {
                                ...current.data.playlist,
                                videos: [...current.data.playlist.videos, data.data.video],
                            },
                        },
                    };
                },
            );
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

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                if (error.fieldErrors['video']) {
                    removeVideoFromCache(variables.playlistId, variables.videoId);
                }
                if (error.fieldErrors['playlist']) {
                    removePlaylistFromCache(queryClient, variables.playlistId);
                }
            }
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData<GetPlaylistResponse>(
                ['playlist', variables.playlistId],
                (current) => {
                    if (!current || !data) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            playlist: {
                                ...current.data.playlist,
                                videos: current.data.playlist.videos.map((video) =>
                                    video.id === variables.videoId ? data.data.video : video,
                                ),
                            },
                        },
                    };
                },
            );
        },
        throwOnError: (error) => {
            const playlistNotFound = hasErrorStatus(error, 404) && !!error.fieldErrors['playlist'];
            return !isHandledError(error, [400, 404]) || playlistNotFound;
        },
    });

    const deleteVideoMutation = useMutation({
        mutationFn: deleteVideoFromPlaylist,
        onSuccess: (_, variables) => {
            removeVideoFromCache(variables.playlistId, variables.videoId);
        },
        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                if (error.fieldErrors['video']) {
                    removeVideoFromCache(variables.playlistId, variables.videoId);
                }
                if (error.fieldErrors['playlist']) {
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
        addVideo: addVideoMutation.mutate,
        editVideo: editVideoMutation.mutate,
        deleteVideo: deleteVideoMutation.mutate,
        isAddVideoPending: addVideoMutation.isPending,
    };
}
