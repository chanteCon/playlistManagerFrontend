'use client';

import VideoQueue from '@/components/videos/VideoQueue';
import { usePlaylist } from '@/hooks/usePlaylist';
import { uuidSchema } from '@/schemas/common';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use } from 'react';

type PageProps = {
    params: Promise<{
        id: string;
        videoId: string;
    }>;
};

export default function WatchVideoPage({ params }: PageProps) {
    const { id, videoId } = use(params);

    if (!uuidSchema.safeParse(id).success || !uuidSchema.safeParse(videoId).success) {
        notFound();
    }

    const { playlist, error } = usePlaylist(id);

    if (error) {
        return (
            <div>
                <h2>Unable to load playlist</h2>
                <p>Something went wrong while loading this playlist.</p>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div>
                <h2>Playlist not found</h2>
                <p>This playlist may have been deleted or you may not have access to it.</p>
            </div>
        );
    }

    const videos = playlist.videos;

    const currentVideoIndex = videos.findIndex((video) => video.id === videoId);

    if (currentVideoIndex === -1) {
        return (
            <div>
                <h2>Video not found</h2>
                <p>This video doesnt exist in this playlist.</p>
            </div>
        );
    }
    const video = videos[currentVideoIndex];

    return (
        <div className=" w-full max-w-[1350px] @container p-10 mx-auto @[850px]:mt-2">
            <Link
                href={`/playlist/${id}`}
                className="shadow-[0_4px_4px_-4px_rgba(0,0,0,0.2)] sticky top-0 z-10 block w-full truncate bg-background pb-1 text-xl font-bold tracking-tight @[850px]:hidden hover:text-muted-foreground mb-4"
            >
                {playlist.name}
            </Link>
            <div className="flex w-full flex-col gap-5 items-center @[850px]:flex-row @[850px]:items-stretch justify-between ">
                <section className="min-w-0 flex-[2] @[1000px]:max-w-[900px]">
                    {video.render === false || video.platform !== 'youtube' ? (
                        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border bg-muted/30 px-6 py-10 text-center">
                            <div className="space-y-1">
                                <p className="font-medium">This content can’t be played here</p>
                                <p className="text-sm text-muted-foreground">
                                    This needs to be viewed on its original platform.
                                </p>
                            </div>

                            <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                                View on the original platform →
                            </a>
                        </div>
                    ) : (
                        <div className="w-full">
                            <iframe
                                src={`https://www.youtube.com/embed/${video.platformId}`}
                                title="YouTube video"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                                className="w-full aspect-video rounded-lg border"
                            />
                            <div className="flex flex-col gap-2 mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Having trouble watching this video?{' '}
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-link hover:underline"
                                    >
                                        Watch on YouTube
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-2 mt-4">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {video.title || 'Untitled video'}
                        </h1>

                        {video.description && (
                            <p className="rounded-lg bg-muted/90 p-4 text-sm leading-relaxed text-muted-foreground">
                                {video.description}
                            </p>
                        )}
                    </div>
                </section>

                <VideoQueue
                    id={playlist.id}
                    videos={videos}
                    currentVideoIndex={currentVideoIndex}
                    playlistName={playlist.name}
                />
            </div>
        </div>
    );
}
