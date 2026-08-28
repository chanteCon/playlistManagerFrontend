'use client';
import { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { addVideoToPlaylist, getPlaylist } from '@/requests/protectedRequests';
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
    return {
        playlist: data?.data.playlist,
        isLoading,
        error,
        isAuthPending,
        addVideo,
    };
}
