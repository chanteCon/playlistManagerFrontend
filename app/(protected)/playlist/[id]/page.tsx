'use client';

import AddCard from '@/components/AddCard';
import { Button } from '@/components/ui/button';
import { usePlaylist } from '@/hooks/usePlaylist';
import { addVideoSchema } from '@/schemas/videoSchemas';
import { use, useState } from 'react';
import z from 'zod';
import VideoCard from '@/components/VideoCard';
import AddVideoDialog from '@/components/AddVideoDialog';
import ActionsDropDown from '@/components/ActionsDropDown';

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function Playlist({ params }: PageProps) {
    const { id } = use(params);

    const { playlist, isLoading, error, addVideo } = usePlaylist(id);
    const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);

    const onAddVideoSubmit = async (data: z.infer<typeof addVideoSchema>, playlistId: string) => {
        await addVideo.mutateAsync({ ...data, playlistId });
        setIsAddVideoOpen(false);
    };

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <p className="text-muted-foreground">Loading playlist...</p>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="mx-auto w-full max-w-5xl px-6 py-10">
                <p className="text-muted-foreground">Something went wrong.</p>
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
                        <VideoCard key={video.id} video={video}>
                            <ActionsDropDown
                                className="border border-white bg-black/40 text-white"
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        </VideoCard>
                    ))}
                </div>
            </section>
            <AddVideoDialog
                isOpen={isAddVideoOpen}
                onSubmit={(data) => onAddVideoSubmit(data, playlist.id)}
                onOpenChange={setIsAddVideoOpen}
            >
                <Button disabled={addVideo.isPending} className="w-full" type="submit">
                    {addVideo.isPending ? 'Adding video...' : 'Add video'}
                </Button>
            </AddVideoDialog>
        </main>
    );
}
