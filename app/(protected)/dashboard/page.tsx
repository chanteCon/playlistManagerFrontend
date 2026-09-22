'use client';

import { useState } from 'react';

import { EditInput, PlaylistSummary } from '@/types';

import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';
import { PlaylistGrid } from '@/components/playlists/PlaylistGrid';
import { PlaylistGridSkeleton } from '@/components/skeletons/PlaylistGridSkeleton';
import AddCard from '@/components/common/AddCard';
import { EditDialog } from '@/components/common/EditDialogue';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { ErrorDialog } from '@/components/common/ErrorDialog';

import { usePlaylists } from '@/hooks/usePlaylists';
import { useServerErrors } from '@/hooks/useServerErrors';

import { buildPlaylistUpdates, hasErrorStatus, isHandledError } from '@/lib/utils';
import { uuidSchema } from '@/schemas/common';

function mapPlaylistFieldErrors(fieldErrors: Record<string, string>): Record<string, string> {
    const errors = { ...fieldErrors };

    if (errors.name) {
        errors.title = errors.name;
        delete errors.name;
    }

    return errors;
}

function CreatePlaylistSection({ onOpen }: { onOpen: () => void }) {
    return (
        <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">Create a playlist</h2>

            <AddCard setDialogOpen={onOpen} message="New Playlist" />
        </section>
    );
}

function PlaylistSection({
    isLoading,
    playlists,
    onEdit,
    onDelete,
}: {
    isLoading: boolean;
    playlists: PlaylistSummary[];
    onEdit: (playlist: PlaylistSummary) => void;
    onDelete: (playlistId: string) => void;
}) {
    if (isLoading) {
        return <PlaylistGridSkeleton />;
    }

    if (playlists.length === 0) {
        return (
            <p className="text-muted-foreground">
                No playlists yet. Create a playlist to start adding videos.
            </p>
        );
    }

    return <PlaylistGrid playlists={playlists} onEdit={onEdit} onDelete={onDelete} />;
}

export default function Dashboard() {
    const {
        playlists,
        isLoading,
        error,
        createPlaylistMutation,
        deletePlaylistMutation,
        editPlaylistMutation,
    } = usePlaylists();

    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
    const [playlistToEdit, setPlaylistToEdit] = useState<PlaylistSummary | null>(null);

    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerErrors,
    } = useServerErrors();

    const handleEditPlaylist = (data: EditInput) => {
        if (!playlistToEdit) return;

        if (!uuidSchema.safeParse(playlistToEdit.id).success) {
            setErrorDialog({
                isOpen: true,
                title: 'Invalid playlist',
                message: 'Playlist id must be a uuid',
            });
            return;
        }

        const updates = buildPlaylistUpdates(data);

        editPlaylistMutation.mutate(
            {
                playlistId: playlistToEdit.id,
                ...updates,
            },
            {
                onSuccess: () => {
                    setPlaylistToEdit(null);
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 409])) {
                        setServerErrors(mapPlaylistFieldErrors(error.fieldErrors));
                    }

                    if (hasErrorStatus(error, 404)) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Playlist not found',
                            message: 'This playlist no longer exists.',
                        });
                        setPlaylistToEdit(null);
                    }
                },
            },
        );
    };

    const handleDeletePlaylist = (playlistId: string) => {
        if (!uuidSchema.safeParse(playlistId).success) {
            setErrorDialog({
                isOpen: true,
                title: 'Invalid playlist',
                message: 'Unable to delete this playlist',
            });
            return;
        }

        deletePlaylistMutation.mutate(playlistId, {
            onSuccess: () => {
                setPlaylistToDelete(null);
            },
        });
    };

    type CreatePlaylistInput = { name: string; description?: string | undefined };
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

    if (error) {
        return <p>Something went wrong.</p>;
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <CreatePlaylistSection
                onOpen={() => {
                    setIsAddPlaylistOpen(true);
                    setServerErrors({});
                }}
            />

            <PlaylistSection
                isLoading={isLoading}
                playlists={playlists}
                onEdit={(playlist) => {
                    setServerErrors({});
                    setPlaylistToEdit(playlist);
                }}
                onDelete={setPlaylistToDelete}
            />

            <CreatePlaylistDialog
                isOpen={isAddPlaylistOpen}
                onOpenChange={setIsAddPlaylistOpen}
                serverErrorState={{
                    errors: serverErrors,
                    clearError: clearServerErrors,
                }}
                isPending={createPlaylistMutation.isPending}
                onSubmit={(data) => handleCreatePlaylist(data)}
            />

            {playlistToEdit && (
                <EditDialog
                    message="Edit playlist"
                    isOpen={!!playlistToEdit}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setPlaylistToEdit(null);
                        }
                    }}
                    title={playlistToEdit.name}
                    description={playlistToEdit.description ?? ''}
                    onSubmit={handleEditPlaylist}
                    serverErrorState={{
                        errors: serverErrors,
                        clearError: clearServerErrors,
                    }}
                    isPending={editPlaylistMutation.isPending}
                />
            )}

            <DeleteDialog
                isPending={deletePlaylistMutation.isPending}
                title="Delete Playlist?"
                message="Are you sure you want to delete this playlist? This action cannot be undone."
                itemId={playlistToDelete}
                onCancel={() => setPlaylistToDelete(null)}
                onConfirm={handleDeletePlaylist}
            />

            <ErrorDialog
                title={errorDialog.title}
                message={errorDialog.message}
                isOpen={errorDialog.isOpen}
                onOpenChange={(isOpen) =>
                    setErrorDialog((current) => ({
                        ...current,
                        isOpen,
                    }))
                }
            />
        </div>
    );
}
