'use client';

import { useState } from 'react';
import { EditInput, Playlist } from '@/types';
import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';
import { PlaylistGrid } from '@/components/playlists/PlaylistGrid';
import { usePlaylists } from '@/hooks/usePlaylists';
import AddCard from '@/components/common/AddCard';
import { EditDialog } from '@/components/common/EditDialogue';
import { DeleteDialog } from '@/components/common/DeleteDialog';

export default function Dashboard() {
    const {
        playlists,
        isLoading,
        error,
        isAuthPending,
        createPlaylist,
        deletePlaylist,
        editPlaylist,
    } = usePlaylists();

    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
    const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
    const [isEditPlaylistOpen, setIsEditPlaylistOpen] = useState(false);

    const onEditPlaylistSubmit = (data: EditInput, playlistToEdit: Playlist | null) => {
        if (!playlistToEdit) return;

        const { title, description } = data;

        const updates = Object.fromEntries(
            Object.entries({
                name: title,
                description,
            }).filter(([, value]) => value !== ''),
        );
        editPlaylist({
            playlistId: playlistToEdit.id,
            ...updates,
        });

        setPlaylistToEdit(null);
        setIsEditPlaylistOpen(false);
    };

    if (isAuthPending) {
        return <p>Checking authentication...</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Something went wrong.</p>;
    }
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold">Create a playlist</h2>
                <AddCard
                    setDialogOpen={() => setIsAddPlaylistOpen(true)}
                    message={'New Playlist'}
                />
            </section>
            {playlists.length > 0 ? (
                <section className="w-full max-w-[960px]">
                    <PlaylistGrid
                        playlists={playlists}
                        onEdit={(playlist) => {
                            setPlaylistToEdit(playlist);
                            setIsEditPlaylistOpen(true);
                        }}
                        onDelete={(playlistId) => {
                            setPlaylistToDelete(playlistId);
                        }}
                    />
                </section>
            ) : (
                <p className="text-muted-foreground">
                    No playlists yet. Create a playlist to start adding videos.
                </p>
            )}

            <CreatePlaylistDialog
                isOpen={isAddPlaylistOpen}
                onOpenChange={setIsAddPlaylistOpen}
                onSubmit={(data) => {
                    createPlaylist(data, {
                        onSuccess: () => {
                            setIsAddPlaylistOpen(false);
                        },
                    });
                }}
            />

            {playlistToEdit && (
                <EditDialog
                    isOpen={isEditPlaylistOpen}
                    onOpenChange={setIsEditPlaylistOpen}
                    title={playlistToEdit.name}
                    description={playlistToEdit.description ?? ''}
                    submitLabel="Edit Playlist"
                    onSubmit={(data) => onEditPlaylistSubmit(data, playlistToEdit)}
                />
            )}

            <DeleteDialog
                title="Delete Playlist?"
                message="Are you sure you want to delete this playlist? This action cannot be undone."
                itemId={playlistToDelete}
                onCancel={() => setPlaylistToDelete(null)}
                onConfirm={(playlistId) => {
                    deletePlaylist(playlistId, {
                        onSuccess: () => {
                            setPlaylistToDelete(null);
                        },
                    });
                }}
            />
        </div>
    );
}
