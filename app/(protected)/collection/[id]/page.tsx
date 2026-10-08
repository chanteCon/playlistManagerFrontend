'use client';

import { use, useState } from 'react';

import { useCollection } from '@/hooks/useCollection';
import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { Music, Plus, Trash } from 'lucide-react';
import AddCard from '@/components/common/AddCard';
import { usePlaylists } from '@/hooks/usePlaylists';
import { hasErrorStatus, isHandledError, markCollectionInteracted } from '@/lib/utils';
import { toast } from 'sonner';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import AddPlaylistDialog from '@/components/collections/AddPlaylistDialog';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { useCollections } from '@/hooks/useCollections';
import { notFound, useRouter } from 'next/navigation';
import { uuidSchema } from '@/schemas/common';
import { PlaylistHeaderSkeleton } from '@/components/skeletons/PlaylistHeaderSkeleton';
import CollectionHeader from '@/components/collections/CollectionHeader';
import { ItemGridSkeleton } from '@/components/skeletons/ItemGridSkeleton';
import { Button } from '@/components/ui/button';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function CollectionPage({ params }: PageProps) {
    const { id } = use(params);
    if (!uuidSchema.safeParse(id).success) {
        notFound();
    }
    const { collection, isLoading, addPlaylistMutation, deletePlaylistMutation } = useCollection({
        id,
    });
    markCollectionInteracted(id);

    const { deleteCollectionMutation } = useCollections();
    const { playlists } = usePlaylists();
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });
    const router = useRouter();
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
    const [selectedPlaylistToDelete, setSelectedPlaylistToDelete] = useState<string | null>(null);

    const availablePlaylists = playlists?.filter(
        (playlist) => !collection?.playlists.some((p) => p.id === playlist.id),
    );

    const handleAddPlaylists = async () => {
        if (!collection) {
            return;
        }
        try {
            await Promise.all(
                selectedPlaylists.map((playlist) =>
                    addPlaylistMutation.mutateAsync({
                        collectionId: collection.id,
                        playlistId: playlist,
                    }),
                ),
            );

            toast('Playlists added to collection!');
            setSelectedPlaylists([]);
            setIsAddPlaylistOpen(false);
        } catch (error) {
            if (hasErrorStatus(error, 404) && error.fieldErrors['playlist']) {
                setErrorDialog({
                    isOpen: true,
                    title: 'Playlist not found',
                    message: 'This playlist no longer exists.',
                });
            }

            if (isHandledError(error, [400, 409])) {
                setErrorDialog({
                    isOpen: true,
                    title: error.message,
                    message: error.fieldErrors[1],
                });
            }
        }
    };

    const handleDeleteCollection = async () => {
        if (!collection) {
            return;
        }
        deleteCollectionMutation.mutate(collection.id, {
            onSettled: () => {
                setCollectionToDelete(null);
                router.push('/dashboard');
            },
        });
    };
    const handleDeletePlaylist = () => {
        if (!collection || !selectedPlaylistToDelete) {
            return;
        }

        deletePlaylistMutation.mutate(
            {
                collectionId: collection.id,
                playlistId: selectedPlaylistToDelete,
            },
            {
                onSuccess: () => {
                    toast('Playlist removed from collection');
                    setSelectedPlaylistToDelete(null);
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 404])) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Could not remove playlist from collection',
                            message: error.message,
                        });
                    }
                },
            },
        );
    };

    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-10 flex flex-col gap-10">
            {isLoading || !collection ? (
                <PlaylistHeaderSkeleton />
            ) : (
                <CollectionHeader
                    collection={collection}
                    isLoading={isLoading}
                    editing={editing}
                    onEdit={() => setEditing(true)}
                    onDone={() => setEditing(false)}
                    onDelete={() => collection && setCollectionToDelete(collection.id)}
                />
            )}
            <hr />
            <section className="w-full">
                <h2 className="mb-4 text-xl font-semibold">
                    {`Playlists (${collection?.playlists.length ?? 0})`}
                </h2>

                {isLoading ? (
                    <ItemGridSkeleton />
                ) : collection && collection.playlists.length > 0 ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] justify-items-center gap-5">
                        <AddCard
                            className="h-[200px] w-[200px] rounded-sm border"
                            setDialogOpen={setIsAddPlaylistOpen}
                            message="Add playlist"
                        />

                        {collection.playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                PlaylistIcon={Music}
                            >
                                {editing && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setSelectedPlaylistToDelete(playlist.id)}
                                    >
                                        <Trash />
                                        Remove playlist
                                    </Button>
                                )}
                            </PlaylistCard>
                        ))}
                    </div>
                ) : (
                    <section className="mt-5 w-full">
                        <button
                            onClick={() => setIsAddPlaylistOpen(true)}
                            className="w-full cursor-pointer hover:text-primary"
                        >
                            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                                <Plus />
                                <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                                    Start adding playlists to this collection.
                                </p>
                            </div>
                        </button>
                    </section>
                )}
            </section>

            {isAddPlaylistOpen && (
                <AddPlaylistDialog
                    isOpen={isAddPlaylistOpen}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setIsAddPlaylistOpen(false);
                            setSelectedPlaylists([]);
                        }
                    }}
                    availablePlaylists={availablePlaylists}
                    selectedPlaylists={selectedPlaylists}
                    setSelectedPlaylists={setSelectedPlaylists}
                    onClick={handleAddPlaylists}
                    isPending={addPlaylistMutation.isPending}
                />
            )}
            <ErrorDialog
                isOpen={errorDialog.isOpen}
                onOpenChange={() =>
                    setErrorDialog((current) => ({
                        ...current,
                        isOpen: false,
                    }))
                }
                message={errorDialog.message}
                title={errorDialog.title}
            />
            <DeleteDialog
                itemId={collectionToDelete}
                onCancel={() => setCollectionToDelete(null)}
                onConfirm={handleDeleteCollection}
                title="Delete Collection"
                message={'Are you sure you want to delete this collection?'}
                isPending={false}
            />
            <DeleteDialog
                itemId={selectedPlaylistToDelete}
                onCancel={() => setSelectedPlaylistToDelete(null)}
                onConfirm={handleDeletePlaylist}
                title="Remove playlist"
                message={'Are you sure you want to remove this playlist from this collection?'}
                isPending={false}
            />
        </main>
    );
}
