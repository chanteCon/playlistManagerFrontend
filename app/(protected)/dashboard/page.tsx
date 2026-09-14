'use client';

import { useState } from 'react';
import { EditInput, Playlist } from '@/types';
import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';
import { PlaylistGrid } from '@/components/playlists/PlaylistGrid';
import { usePlaylists } from '@/hooks/usePlaylists';
import AddCard from '@/components/common/AddCard';
import { EditDialog } from '@/components/common/EditDialogue';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { uuidSchema } from '@/schemas/common';
import { PlaylistGridSkeleton } from '@/components/skeletons/PlaylistGridSkeleton';

export default function Dashboard() {
    const {
        playlists,
        isLoading,
        error,
        createPlaylist,
        createPlaylistPending,
        deletePlaylist,
        editPlaylist,
        editPlaylistPending,
        deletePlaylistPending,
    } = usePlaylists();

    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
    const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
    const [isEditPlaylistOpen, setIsEditPlaylistOpen] = useState(false);
    type ErrorDialogState = {
        isOpen: boolean;
        title: string;
        message: string;
    };

    const mapPlaylistFieldErrors = (
        fieldErrors: Record<string, string>,
    ): Record<string, string> => {
        const errors = { ...fieldErrors };

        if (errors.name) {
            errors.title = errors.name;
            delete errors.name;
        }

        return errors;
    };

    const [errorDialog, setErrorDialog] = useState<ErrorDialogState>({
        isOpen: false,
        title: '',
        message: '',
    });
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerErrors,
    } = useServerErrors();
    const onEditPlaylistSubmit = (data: EditInput, playlistToEdit: Playlist | null) => {
        if (!playlistToEdit) return;
        if (!uuidSchema.safeParse(playlistToEdit.id).success) {
            setErrorDialog({
                isOpen: true,
                title: 'Invalid playlist',
                message: 'Playlist id must be a uuid',
            });
            return;
        }
        const { title, description } = data;

        const updates = Object.fromEntries(
            Object.entries({
                name: title,
                description,
            }).filter(([, value]) => value !== ''),
        );
        editPlaylist(
            {
                playlistId: playlistToEdit.id,
                ...updates,
            },
            {
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
                        setIsEditPlaylistOpen(false);
                    }
                },
                onSuccess() {
                    setPlaylistToEdit(null);
                    setIsEditPlaylistOpen(false);
                },
            },
        );
    };

    if (error) {
        return <p>Something went wrong.</p>;
    }
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold">Create a playlist</h2>
                <AddCard
                    setDialogOpen={() => {
                        setIsAddPlaylistOpen(true);
                        setServerErrors({});
                    }}
                    message={'New Playlist'}
                />
            </section>
            {isLoading ? (
                <PlaylistGridSkeleton />
            ) : playlists.length > 0 ? (
                <PlaylistGrid
                    playlists={playlists}
                    onEdit={(playlist) => {
                        setServerErrors({});
                        setPlaylistToEdit(playlist);
                        setIsEditPlaylistOpen(true);
                    }}
                    onDelete={(playlistId) => {
                        setPlaylistToDelete(playlistId);
                    }}
                />
            ) : (
                <p className="text-muted-foreground">
                    No playlists yet. Create a playlist to start adding videos.
                </p>
            )}

            <CreatePlaylistDialog
                isOpen={isAddPlaylistOpen}
                onOpenChange={setIsAddPlaylistOpen}
                serverErrorState={{
                    errors: serverErrors,
                    clearError: clearServerErrors,
                }}
                isPending={createPlaylistPending}
                onSubmit={(data) => {
                    createPlaylist(data, {
                        onSuccess: () => {
                            setIsAddPlaylistOpen(false);
                        },
                        onError: (error) => {
                            if (isHandledError(error, [400, 409])) {
                                setServerErrors(error.fieldErrors);
                            }
                        },
                    });
                }}
            />

            {playlistToEdit && (
                <EditDialog
                    message={'Edit playlist'}
                    isOpen={isEditPlaylistOpen}
                    onOpenChange={setIsEditPlaylistOpen}
                    title={playlistToEdit.name}
                    description={playlistToEdit.description ?? ''}
                    onSubmit={(data) => onEditPlaylistSubmit(data, playlistToEdit)}
                    serverErrorState={{
                        errors: serverErrors,
                        clearError: clearServerErrors,
                    }}
                    isPending={editPlaylistPending}
                />
            )}

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

            <DeleteDialog
                isPending={deletePlaylistPending}
                title="Delete Playlist?"
                message="Are you sure you want to delete this playlist? This action cannot be undone."
                itemId={playlistToDelete}
                onCancel={() => setPlaylistToDelete(null)}
                onConfirm={(playlistId) => {
                    if (!uuidSchema.safeParse(playlistId).success) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Invalid playlist',
                            message: 'Unable to delete this playlist',
                        });
                        return;
                    }
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
