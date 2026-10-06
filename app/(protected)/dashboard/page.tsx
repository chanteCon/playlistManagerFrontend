'use client';

import { useState } from 'react';

import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';

import { useCollections } from '@/hooks/useCollections';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useServerErrors } from '@/hooks/useServerErrors';

import { isHandledError, sortByRecentActivity } from '@/lib/utils';

import { CreateCollectionDialog } from '@/components/collections/CreateCollctionDialog';
import PlaylistPreviewSection from '@/components/dashboard/PlaylistSection';
import CollectionsPreviewSection from '@/components/dashboard/CollectionsPreviewSection';

export default function Dashboard() {
    const { playlists, isLoading: playlistsLoading, createPlaylistMutation } = usePlaylists();

    const {
        collections,
        isLoading: collectionsLoading,
        createCollectionMutation,
    } = useCollections();

    const sortedPlaylists = sortByRecentActivity(playlists, 'playlist-last-opened');

    const sortedCollections = sortByRecentActivity(collections, 'collection-last-opened');

    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);

    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerErrors,
    } = useServerErrors();

    type CreatePlaylistInput = {
        name: string;
        description?: string;
    };

    const handleCreatePlaylist = (data: CreatePlaylistInput) => {
        createPlaylistMutation.mutate(data, {
            onSuccess: () => {
                setIsAddPlaylistOpen(false);
            },
            onError: (error) => {
                if (isHandledError(error, [400, 409])) {
                    setServerErrors(error.fieldErrors);
                }
            },
        });
    };

    const handleCreateCollection = (data: { name: string }) => {
        createCollectionMutation.mutate(data, {
            onSuccess: () => {
                setIsAddCollectionOpen(false);
            },
            onError: (error) => {
                if (isHandledError(error, [400, 409])) {
                    setServerErrors(error.fieldErrors);
                }
            },
        });
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <div className="border-b pb-5">
                <h1 className="text-2xl font-semibold tracking-tight">Your library</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Your playlists and collections to organise cross platform videos.
                </p>
            </div>
            <PlaylistPreviewSection
                isLoading={playlistsLoading}
                playlists={sortedPlaylists}
                onCreate={() => {
                    setIsAddPlaylistOpen(true);
                    setServerErrors({});
                }}
            />

            {((playlists && playlists.length > 0) || collections.length > 0) && (
                <CollectionsPreviewSection
                    isLoading={collectionsLoading}
                    collections={sortedCollections}
                    onCreate={() => {
                        setIsAddCollectionOpen(true);
                        setServerErrors({});
                    }}
                />
            )}
            <CreatePlaylistDialog
                isOpen={isAddPlaylistOpen}
                onOpenChange={setIsAddPlaylistOpen}
                serverErrorState={{
                    errors: serverErrors,
                    clearError: clearServerErrors,
                }}
                isPending={createPlaylistMutation.isPending}
                onSubmit={handleCreatePlaylist}
            />
            <CreateCollectionDialog
                isOpen={isAddCollectionOpen}
                onOpenChange={setIsAddCollectionOpen}
                serverErrorState={{
                    errors: serverErrors,
                    clearError: clearServerErrors,
                }}
                isPending={createCollectionMutation.isPending}
                onSubmit={handleCreateCollection}
            />
        </div>
    );
}
