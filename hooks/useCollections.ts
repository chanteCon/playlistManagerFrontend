'use client';

import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError, removeCollectionFromCache } from '@/lib/utils';
import {
    createCollection,
    deleteCollection,
    editCollection,
    getCollections,
} from '@/requests/protectedRequests';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCollections() {
    const queryClient = useQueryClient();
    const { isAuthPending } = useAuth();

    const invalidateCollection = (collectionId: string) => {
        queryClient.invalidateQueries({
            queryKey: ['collections'],
        });

        queryClient.invalidateQueries({
            queryKey: ['collection', collectionId],
        });
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['collections'],
        queryFn: getCollections,
        enabled: isAuthPending === false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const createCollectionMutation = useMutation({
        mutationFn: createCollection,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['collections'],
            });
        },

        throwOnError: (error) => {
            return !isHandledError(error, [400, 409]);
        },
    });

    const editCollectionMutation = useMutation({
        mutationFn: editCollection,

        onSuccess: (_, variables) => {
            invalidateCollection(variables.collectionId);
        },

        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                queryClient.removeQueries({
                    queryKey: ['collection', variables.collectionId],
                });

                removeCollectionFromCache(queryClient, variables.collectionId);
            }
        },

        throwOnError: (error) => {
            return !isHandledError(error, [400, 404, 409]);
        },
    });

    const deleteCollectionMutation = useMutation({
        mutationFn: deleteCollection,

        onSuccess: (_, collectionId) => {
            queryClient.removeQueries({
                queryKey: ['collection', collectionId],
            });

            queryClient.invalidateQueries({
                queryKey: ['collections'],
            });
        },

        onError: (error, collectionId) => {
            if (hasErrorStatus(error, 404)) {
                queryClient.removeQueries({
                    queryKey: ['collection', collectionId],
                });

                removeCollectionFromCache(queryClient, collectionId);
            }
        },

        throwOnError: (error) => {
            return !isHandledError(error, [400, 404]);
        },
    });

    return {
        collections: data?.data.collections ?? [],
        isLoading,
        error,
        isAuthPending,
        createCollectionMutation,
        editCollectionMutation,
        deleteCollectionMutation,
    };
}
