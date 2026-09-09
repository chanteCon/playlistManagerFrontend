'use client';
import { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
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

    const { isAuthPending } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['playlist', id],
        queryFn: () => getPlaylist(id),
        enabled: isAuthPending === false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const addVideo = useMutation({
        mutationFn: addVideoToPlaylist,

        onError: (error) => alert(error),

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
    });

    const editVideo = useMutation({
        mutationFn: patchVideo,

        onError: (error) => alert(error),
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
    });

    const deleteVideo = useMutation({
        mutationFn: deleteVideoFromPlaylist,
        onError: (error) => alert(error),
        onSuccess: (_, variables) => {
            queryClient.setQueryData<GetPlaylistResponse>(
                ['playlist', variables.playlistId],
                (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            playlist: {
                                ...current.data.playlist,
                                videos: current.data.playlist.videos.filter(
                                    (video) => video.id !== variables.videoId,
                                ),
                            },
                        },
                    };
                },
            );
        },
    });
    return {
        playlist: data?.data.playlist,
        isLoading,
        error,
        isAuthPending,
        addVideo,
        editVideo,
        deleteVideo,
    };
}
