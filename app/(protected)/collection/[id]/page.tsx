'use client';

import { use, useState } from 'react';

import { useCollection } from '@/hooks/useCollection';
import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { Music, Plus } from 'lucide-react';
import AddCard from '@/components/common/AddCard';
import { usePlaylists } from '@/hooks/usePlaylists';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { toast } from 'sonner';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import AddPlaylistDialog from '@/components/collections/AddPlaylistDialog';
import CreateCollection from '@/components/collections/CreateCollection';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function CollectionPage({ params }: PageProps) {
    const { id } = use(params);
    const { collection, addPlaylistMutation } = useCollection({ id });
    const { playlists } = usePlaylists();
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
    if (!collection) {
        return null;
    }
    const availablePlaylists = playlists?.filter(
        (playlist) =>
            !collection.playlists.some(
                (collectionPlaylist) => collectionPlaylist.id === playlist.id,
            ),
    );

    const handleAddPlaylists = async () => {
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

    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-10 flex flex-col gap-10">
            <section className="flex items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold">{collection.name}</h1>
                </div>
            </section>
            <hr />
            <section>
                <h2 className="mb-4 text-xl font-semibold">
                    {`Playlists (${collection.playlists.length})`}
                </h2>

                {collection.playlists.length > 0 ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
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
                                <p></p>
                            </PlaylistCard>
                        ))}
                    </div>
                ) : (
                    <section className="w-full mt-5 ">
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
        </main>
    );
}
