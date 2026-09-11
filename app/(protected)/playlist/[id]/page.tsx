'use client';

import AddCard from '@/components/common/AddCard';
import { Button } from '@/components/ui/button';
import { usePlaylist } from '@/hooks/usePlaylist';
import { addVideoSchema } from '@/schemas/videoSchemas';
import { use, useState } from 'react';
import z from 'zod';
import VideoCard from '@/components/videos/VideoCard';
import AddVideoDialog from '@/components/videos/AddVideoDialog';
import ActionsDropDown from '@/components/common/ActionsDropDown';
import { EditDialog } from '@/components/common/EditDialogue';
import { Video } from '@/types';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { useServerErrors } from '@/hooks/useServerErrors';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { uuidSchema } from '@/schemas/common';

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

    const { playlist, isLoading, addVideo, editVideo, deleteVideo, isAddVideoPending } =
        usePlaylist(id);
    const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);
    const [isEditVideoOpen, setIsEditVideoOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);
    const [videoToEdit, setVideoToEdit] = useState<Video | null>(null);

    const serverErrorState = useServerErrors();

    const onAddVideoSubmit = async (data: z.infer<typeof addVideoSchema>, playlistId: string) => {
        addVideo(
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

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <p className="text-muted-foreground">Loading playlist...</p>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <p className="text-muted-foreground">Something went wrong</p>
            </div>
        );
    }

    return (
        <main className="mx-auto w-full max-w-5xl px-6 py-10">
            <section className="border-b pb-8 flex justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{playlist.name}</h1>

                    <p className="mt-3 max-w-2xl text-muted-foreground">
                        {playlist.description || 'No description'}
                    </p>
                </div>
            </section>
            <section className="py-8 flex flex-col gap-5">
                <h2 className="text-lg font-semibold">Videos</h2>
                {!playlist?.videos ||
                    (playlist.videos.length === 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            No videos in this playlist yet.
                        </p>
                    ))}
                <div className="grid w-fit max-w-full grid-cols-[repeat(auto-fill,220px)] justify-start gap-6">
                    <AddCard
                        className="h-[200px] w-[220px] rounded-sm border"
                        setDialogOpen={() => setIsAddVideoOpen(true)}
                        message="Add video"
                    />

                    {playlist?.videos?.map((video) => (
                        <VideoCard key={video.id} video={video} playlistId={playlist.id}>
                            <ActionsDropDown
                                className="border border-white bg-black/40 text-white"
                                onEdit={() => {
                                    setVideoToEdit(video);
                                    setIsEditVideoOpen(true);
                                }}
                                onDelete={() => {
                                    setVideoToDelete(video);
                                }}
                            />
                        </VideoCard>
                    ))}
                </div>
            </section>
            <AddVideoDialog
                isOpen={isAddVideoOpen}
                onSubmit={(data) => onAddVideoSubmit(data, playlist.id)}
                onOpenChange={setIsAddVideoOpen}
                serverErrorState={serverErrorState}
            >
                <Button disabled={isAddVideoPending} className="w-full" type="submit">
                    {isAddVideoPending ? 'Adding video...' : 'Add video'}
                </Button>
            </AddVideoDialog>
            {videoToEdit && (
                <EditDialog
                    isOpen={isEditVideoOpen}
                    onOpenChange={setIsEditVideoOpen}
                    title={videoToEdit.title}
                    description={videoToEdit.description || ''}
                    onSubmit={(data) => {
                        if (!videoToEdit) return;
                        const updates = Object.fromEntries(
                            Object.entries(data).filter(([, value]) => value !== ''),
                        );

                        editVideo.mutate({
                            playlistId: playlist.id,
                            videoId: videoToEdit.id,
                            ...updates,
                        });

                        setIsEditVideoOpen(false);
                        setVideoToEdit(null);
                    }}
                    submitLabel="Save changes"
                />
            )}
            {videoToDelete && (
                <DeleteDialog
                    itemId={videoToDelete.id}
                    title="Delete Video?"
                    message="Are you sure you want to delete this video?"
                    onCancel={() => setVideoToDelete(null)}
                    onConfirm={() => {
                        if (!videoToDelete) return;
                        deleteVideo.mutate({
                            playlistId: playlist.id,
                            videoId: videoToDelete.id,
                        });
                        setVideoToDelete(null);
                    }}
                />
            )}
        </main>
    );
}
