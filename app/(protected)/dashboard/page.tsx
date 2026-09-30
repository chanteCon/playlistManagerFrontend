'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import AddCard from '@/components/common/AddCard';
import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';
import { PlaylistCard } from '@/components/playlists/PlaylistCard';

import { useCollections } from '@/hooks/useCollections';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useServerErrors } from '@/hooks/useServerErrors';

import { isHandledError } from '@/lib/utils';

import { Folder, Music } from 'lucide-react';

import { CollectionSummary, PlaylistSummary } from '@/types';

function PlaylistSection({
    isLoading,
    playlists,
    onCreate,
}: {
    isLoading: boolean;
    playlists: PlaylistSummary[];
    onCreate: () => void;
}) {
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    if (playlists.length === 0) {
        return (
            <section className="mb-12">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Playlists</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Organise your favourite videos into playlists.
                    </p>
                </div>

                <AddCard setDialogOpen={onCreate} message="Create your first playlist" />
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Recent playlists</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Your latest playlists.</p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium hover:underline"
                    onClick={() => router.push('/playlist')}
                >
                    See all
                </button>
            </div>

            <div className="flex gap-4 overflow-hidden">
                {playlists.slice(0, 5).map((playlist) => (
                    <div key={playlist.id} className="w-[220px] shrink-0">
                        <PlaylistCard playlist={playlist} PlaylistIcon={Music}>
                            <p />
                        </PlaylistCard>
                    </div>
                ))}

                <div className="w-[220px] shrink-0">
                    <AddCard setDialogOpen={onCreate} message="New Playlist" />
                </div>
            </div>
        </section>
    );
}

function CollectionSection({
    isLoading,
    collections,
    onCreate,
}: {
    isLoading: boolean;
    collections: CollectionSummary[];
    onCreate: () => void;
}) {
    if (isLoading) {
        return null;
    }

    if (collections.length === 0) {
        return (
            <section className="mb-12">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Collections</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Group your playlists together.
                    </p>
                </div>

                <AddCard setDialogOpen={onCreate} message="Create your first collection" />
            </section>
        );
    }

    return (
        <section className="mb-12">
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Recent collections</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Your latest collections.</p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium hover:underline"
                    onClick={() => {}}
                >
                    See all
                </button>
            </div>

            <div className="flex gap-4 overflow-hidden">
                {collections.slice(0, 5).map((collection) => (
                    <div
                        key={collection.id}
                        className="flex h-[220px] w-[220px] shrink-0 flex-col items-center justify-center rounded-lg border"
                    >
                        <Folder className="mb-4 h-10 w-10" />
                        <p className="font-medium">{collection.name}</p>
                    </div>
                ))}

                <div className="w-[220px] shrink-0">
                    <AddCard setDialogOpen={onCreate} message="New Collection" />
                </div>
            </div>
        </section>
    );
}

export default function Dashboard() {
    const { playlists, isLoading: playlistsLoading, createPlaylistMutation } = usePlaylists();

    const { collections, isLoading: collectionsLoading } = useCollections();

    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);

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

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <PlaylistSection
                isLoading={playlistsLoading}
                playlists={playlists}
                onCreate={() => {
                    setIsAddPlaylistOpen(true);
                    setServerErrors({});
                }}
            />

            {playlists && playlists.length > 0 && (
                <CollectionSection
                    isLoading={collectionsLoading}
                    collections={collections}
                    onCreate={() => {}}
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
        </div>
    );
}
