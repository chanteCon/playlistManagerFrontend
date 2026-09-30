'use client';

import { useAuth } from '@/contexts/AuthContext';

import {
    addPlaylistToCollection,
    deletePlaylistFromCollection,
    getCollection,
} from '@/requests/protectedRequests';

import { GetCollectionResponse, GetCollectionsResponse } from '@/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type UseCollectionParams = {
    id: string;
};

export function useCollection({ id }: UseCollectionParams) {
    const queryClient = useQueryClient();

    const { isAuthPending } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['collection', id],
        queryFn: () => getCollection({ id }),
        enabled: !isAuthPending,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const updateCollectionCount = (change: 1 | -1) => {
        queryClient.setQueryData<GetCollectionsResponse>(['collections'], (current) => {
            if (!current) return current;

            return {
                ...current,
                data: {
                    ...current.data,
                    collections: current.data.collections.map((currentCollection) =>
                        currentCollection.id === id
                            ? {
                                  ...currentCollection,
                                  numPlaylists: currentCollection.numPlaylists + change,
                              }
                            : currentCollection,
                    ),
                },
            };
        });
    };

    const addPlaylistMutation = useMutation({
        mutationFn: addPlaylistToCollection,

        onSuccess: (data, variables) => {
            if (!data) return;

            const playlist = data.data.playlist;

            queryClient.setQueryData<GetCollectionResponse>(
                ['collection', variables.collectionId],
                (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            collection: {
                                ...current.data.collection,
                                numPlaylists: current.data.collection.numPlaylists + 1,
                                playlists: [...current.data.collection.playlists, playlist],
                            },
                        },
                    };
                },
            );

            updateCollectionCount(1);
        },
    });

    const deletePlaylistMutation = useMutation({
        mutationFn: deletePlaylistFromCollection,

        onSuccess: (_, variables) => {
            queryClient.setQueryData<GetCollectionResponse>(
                ['collection', variables.collectionId],
                (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            collection: {
                                ...current.data.collection,
                                numPlaylists: Math.max(0, current.data.collection.numPlaylists - 1),
                                playlists: current.data.collection.playlists.filter(
                                    (playlist) => playlist.id !== variables.playlistId,
                                ),
                            },
                        },
                    };
                },
            );

            updateCollectionCount(-1);
        },
    });

    return {
        data,
        isLoading,
        error,
        addPlaylistMutation,
        deletePlaylistMutation,
    };
}
