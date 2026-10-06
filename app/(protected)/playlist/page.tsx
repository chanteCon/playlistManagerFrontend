'use client';

import { useState } from 'react';

import { EditInput, PlaylistSummary } from '@/types';

import { CreatePlaylistDialog } from '@/components/playlists/CreatePlaylistDialog';
import { PlaylistGrid } from '@/components/playlists/PlaylistGrid';
import { PlaylistGridSkeleton } from '@/components/skeletons/PlaylistGridSkeleton';
import { EditDialog } from '@/components/common/EditDialogue';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { ErrorDialog } from '@/components/common/ErrorDialog';

import { usePlaylists } from '@/hooks/usePlaylists';
import { useServerErrors } from '@/hooks/useServerErrors';

import {
    buildPlaylistUpdates,
    hasErrorStatus,
    isHandledError,
    mapPlaylistFieldErrors,
} from '@/lib/utils';
import { uuidSchema } from '@/schemas/common';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

function PlaylistSection({
    isLoading,
    playlists,
    onEdit,
    onDelete,
    onCreate,
}: {
    isLoading: boolean;
    playlists: PlaylistSummary[];
    onEdit: (playlist: PlaylistSummary) => void;
    onDelete: (playlistId: string) => void;
    onCreate: () => void;
}) {
    if (isLoading) {
        return <PlaylistGridSkeleton />;
    }

    if (playlists.length === 0) {
        return (
            <section className="w-full ">
                <h2 className="mb-6 text-lg font-semibold">Your playlists</h2>
                <button onClick={onCreate} className="w-full cursor-pointer hover:text-primary">
                    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                        <Plus />
                        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                            Create a playlist to start organising videos.
                        </p>
                    </div>
                </button>
            </section>
        );
    }

    return (
        <Card className="min-h-0 flex-1 py-15">
            <PlaylistGrid
                playlists={playlists}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreate={onCreate}
            />
        </Card>
    );
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
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-8">
            <h2 className="mb-4 text-lg font-semibold">Your playlists</h2>
            <PlaylistSection
                isLoading={isLoading}
                playlists={playlists}
                onEdit={(playlist) => {
                    setServerErrors({});
                    setPlaylistToEdit(playlist);
                }}
                onDelete={setPlaylistToDelete}
                onCreate={() => setIsAddPlaylistOpen(true)}
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
