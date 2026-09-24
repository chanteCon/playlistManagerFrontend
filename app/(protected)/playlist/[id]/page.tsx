'use client';

import { Button } from '@/components/ui/button';
import { usePlaylist } from '@/hooks/usePlaylist';
import { addVideoSchema } from '@/schemas/videoSchemas';
import { use, useState } from 'react';
import z from 'zod';
import AddVideoDialog from '@/components/videos/AddVideoDialog';
import { EditDialog } from '@/components/common/EditDialogue';
import { EditInput, Video } from '@/types';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { useServerErrors } from '@/hooks/useServerErrors';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { uuidSchema } from '@/schemas/common';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import PlaylistHeader from '@/components/videos/PlaylistHeader';
import VideoGrid from '@/components/videos/VideoGrid';
import { PlaylistHeaderSkeleton } from '@/components/skeletons/PlaylistHeaderSkeleton';
import { usePlaylists } from '@/hooks/usePlaylists';
import { toast } from 'sonner';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function Playlist({ params }: PageProps) {
    const { id } = use(params);

    if (!uuidSchema.safeParse(id).success) {
        notFound();
    }

    const { playlist, isLoading, addVideoMutation, editVideoMutation, deleteVideoMutation } =
        usePlaylist(id);
    const { editPlaylistMutation } = usePlaylists();
    const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
    const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);
    const [editingPlaylist, seteditingPlaylist] = useState(false);
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });
    const serverErrorState = useServerErrors();

    const onAddVideoSubmit = async (data: z.infer<typeof addVideoSchema>, playlistId: string) => {
        addVideoMutation.mutate(
            { ...data, playlistId },
            {
                onSuccess: () => {
                    setIsAddVideoOpen(false);
                    serverErrorState.setErrors({});
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 409])) {
                        serverErrorState.setErrors(error.fieldErrors);
                    }
                    if (hasErrorStatus(error, 502)) {
                        serverErrorState.setErrors({ url: error.message });
                    }
                },
            },
        );
    };

    const handleEditVideo = (data: EditInput) => {
        if (!playlist || !videoToEdit) return;

        const updates = {
            title: data.title,
            description: data.description,
        };

        editVideoMutation.mutate(
            {
                playlistId: playlist.id,
                videoId: videoToEdit.id,
                ...updates,
            },
            {
                onSuccess: () => {
                    setVideoToEdit(null);
                },
                onError: (error) => {
                    if (hasErrorStatus(error, 400)) {
                        serverErrorState.setErrors(error.fieldErrors);
                    }

                    if (hasErrorStatus(error, 404) && !!error.fieldErrors['video']) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Video not found',
                            message: 'This video no longer exists in this playlist',
                        });
                        setVideoToEdit(null);
                    }
                },
            },
        );
    };

    const handleDeleteVideo = () => {
        if (!playlist || !videoToDelete) return;

        deleteVideoMutation.mutate(
            {
                playlistId: playlist.id,
                videoId: videoToDelete,
            },
            {
                onError: (error) => {
                    if (hasErrorStatus(error, 404) && !!error.fieldErrors['video']) {
                        setVideoToDelete(null);
                    }
                },
                onSuccess: () => {
                    setVideoToDelete(null);
                },
            },
        );
    };

    const onSelectCover = (video: Video) => {
        if (!playlist) {
            return;
        }
        const updates = { cover: video.id };
        editPlaylistMutation.mutate(
            {
                playlistId: playlist.id,
                ...updates,
            },
            {
                onSuccess: () => {
                    toast.success('Playlist updated');
                },
                onError: (error) => {
                    if (isHandledError(error, [400])) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Unable to update playlist',
                            message: 'The selected video could not be set as the playlist cover.',
                        });
                    }

                    if (hasErrorStatus(error, 404)) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Playlist not found',
                            message: 'This playlist no longer exists.',
                        });
                    }
                },
            },
        );
    };

    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-10">
            {isLoading || !playlist ? (
                <PlaylistHeaderSkeleton />
            ) : (
                <PlaylistHeader playlist={playlist} onEdit={seteditingPlaylist} />
            )}

            <section className="py-8 flex flex-col gap-5">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Videos</h2>
                    <span className="text-sm text-muted-foreground">
                        ({playlist?.numVideos ?? 0})
                    </span>
                </div>

                <VideoGrid
                    isLoading={isLoading}
                    playlist={playlist}
                    onEdit={(video) => {
                        serverErrorState.setErrors({});
                        setVideoToEdit(video);
                    }}
                    onDelete={(video) => {
                        setVideoToDelete(video.id);
                    }}
                    setIsAddVideoOpen={setIsAddVideoOpen}
                    editingPlaylist={editingPlaylist}
                    onSelectCover={onSelectCover}
                />
            </section>
            <AddVideoDialog
                isOpen={isAddVideoOpen}
                onSubmit={(data) => onAddVideoSubmit(data, playlist!.id)}
                onOpenChange={setIsAddVideoOpen}
                serverErrorState={serverErrorState}
            >
                <Button disabled={addVideoMutation.isPending} className="w-full" type="submit">
                    {addVideoMutation.isPending ? 'Adding video...' : 'Add video'}
                </Button>
            </AddVideoDialog>

            {videoToEdit && (
                <EditDialog
                    isPending={editVideoMutation.isPending}
                    serverErrorState={serverErrorState}
                    isOpen={!!videoToEdit}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setVideoToEdit(null);
                        }
                    }}
                    title={videoToEdit.title}
                    description={videoToEdit.description || ''}
                    onSubmit={handleEditVideo}
                />
            )}

            <DeleteDialog
                isPending={deleteVideoMutation.isPending}
                itemId={videoToDelete}
                title="Delete Video?"
                message="Are you sure you want to delete this video?"
                onCancel={() => setVideoToDelete(null)}
                onConfirm={handleDeleteVideo}
            />

            <ErrorDialog
                isOpen={errorDialog.isOpen}
                onOpenChange={() =>
                    setErrorDialog((current) => ({
                        ...current,
                        isOpen: false,
                    }))
                }
                title={errorDialog.title}
                message={errorDialog.message}
            />
        </main>
    );
}
