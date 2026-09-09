import { Video } from '@/types';
import VideoCard from './VideoCard';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

type DesktopVideoQueueProps = {
    id: string;
    videos: Video[];
    currentVideoIndex: number;
    playlistName: string;
};

export default function VideoQueue({
    id,
    currentVideoIndex,
    videos,
    playlistName,
}: DesktopVideoQueueProps) {
    const queueRef = useRef<HTMLDivElement>(null);
    const currentVideoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!queueRef.current || !currentVideoRef.current) return;

        const isDesktop = window.matchMedia('(min-width: 850px)').matches;

        queueRef.current.scrollTop = Math.max(
            0,
            currentVideoRef.current.offsetTop - queueRef.current.offsetTop - (isDesktop ? 40 : 0),
        );
    }, [currentVideoIndex]);

    const previousVideos = videos.slice(0, currentVideoIndex);
    const nextVideos = videos.slice(currentVideoIndex + 1);

    return (
        <section className="flex w-full flex-col h-[700px] @[850px]:h-[500px] @[850px]:w-[320px] @[850px]:shrink-0">
            <p className=" block w-full pb-1 text-md font-bold @[850px]:hidden ">Videos</p>
            <hr className=" block @[850px]:hidden mb-5 " />

            <div className="min-h-0 flex-1 rounded-lg bg-muted/90 p-2 @[850px]:border @[850px]:bg-muted/20 @[850px]:p-5">
                <div ref={queueRef} className="h-full overflow-y-auto">
                    <Link
                        href={`/playlist/${id}`}
                        className="sticky top-0 z-10 mb-3 hidden truncate bg-background pb-3 pt-1 text-md font-semibold hover:text-muted-foreground @[850px]:block"
                    >
                        {playlistName}
                    </Link>

                    <div className="flex w-full flex-col items-center gap-4">
                        {previousVideos.length > 0 && (
                            <div className="flex w-full flex-col items-center gap-4">
                                {previousVideos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        playlistId={id}
                                        video={video}
                                        className="w-full max-w-[300px] @[850px]:w-[250px] @[850px]:h-[172px]"
                                    />
                                ))}
                            </div>
                        )}

                        <div
                            ref={currentVideoRef}
                            className="flex w-full justify-center rounded-lg border-2 border-primary/30 bg-primary/5 p-3"
                        >
                            <VideoCard
                                key={videos[currentVideoIndex].id}
                                playlistId={id}
                                video={videos[currentVideoIndex]}
                                className="w-full max-w-[300px] @[850px]:w-[250px] @[850px]:h-[172px]"
                            />
                        </div>

                        {nextVideos.length > 0 && (
                            <div className="flex w-full flex-col items-center gap-4">
                                {nextVideos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        playlistId={id}
                                        video={video}
                                        className="w-full max-w-[300px] @[850px]:w-[250px] @[850px]:h-[172px]"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
