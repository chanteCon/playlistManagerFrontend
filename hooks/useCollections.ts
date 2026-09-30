'use client';

import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import {
    createCollection,
    deleteCollection,
    editCollection,
    getCollections,
} from '@/requests/protectedRequests';
import { GetCollectionsResponse } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCollections() {
    const queryClient = useQueryClient();
    const { isAuthPending } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['collections'],
        queryFn: getCollections,
        enabled: isAuthPending === false,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const createCollectionMutation = useMutation({
        mutationFn: createCollection,
        onSuccess: (data) => {
            queryClient.setQueryData<GetCollectionsResponse>(['collections'], (current) => {
                if (!current || !data) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        collections: [...current.data.collections, data.data.collection],
                    },
                };
            });
        },
        throwOnError: (error) => {
            return !isHandledError(error, [400, 409]);
        },
    });

    const editCollectionMutation = useMutation({
        mutationFn: editCollection,
        onSuccess: (data, variables) => {
            queryClient.setQueryData<GetCollectionsResponse>(['collections'], (current) => {
                if (!current || !data) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        collections: current.data.collections.map((collection) =>
                            collection.id === variables.collectionId
                                ? data.data.collection
                                : collection,
                        ),
                    },
                };
            });
        },
        onError: (error, variables) => {
            if (hasErrorStatus(error, 404)) {
                queryClient.setQueryData<GetCollectionsResponse>(['collections'], (current) => {
                    if (!current) return current;

                    return {
                        ...current,
                        data: {
                            ...current.data,
                            collections: current.data.collections.filter(
                                (collection) => collection.id !== variables.collectionId,
                            ),
                        },
                    };
                });
            }
        },
        throwOnError: (error) => {
            return !isHandledError(error, [400, 404, 409]);
        },
    });

    const deleteCollectionMutation = useMutation({
        mutationFn: deleteCollection,
        onSuccess: (_, collectionId) => {
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
        },
        onError: (error, collectionId) => {
            if (hasErrorStatus(error, 404)) {
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
