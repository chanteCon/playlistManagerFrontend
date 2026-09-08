'use client';

import VideoCard from '@/components/videos/VideoCard';
import { usePlaylist } from '@/hooks/usePlaylist';
import { use } from 'react';

type PageProps = {
    params: Promise<{
        id: string;
        videoId: string;
    }>;
};

export default function WatchVideoPage({ params }: PageProps) {
    const { id, videoId } = use(params);

    const { playlist, isLoading, error } = usePlaylist(id);

    if (isLoading) {
        return <p>Loading...</p>;
    }

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

    const previousVideos = videos.slice(0, currentVideoIndex);
    const nextVideos = videos.slice(currentVideoIndex + 1);

    return (
        <div className="w-full @container px-10">
            <p className="mb-5">{playlist.name}</p>
            <div className="flex w-full flex-col gap-5 items-center @[650px]:flex-row @[650px]:items-stretch @[650px]:gap-10">
                <section className="flex-1 w-full">
                    {video.render === false || video.platform !== 'youtube' ? (
                        <div>
                            <p>This video cant be played inside Playlist Manager.</p>

                            <a href={video.url} target="_blank" rel="noopener noreferrer">
                                Watch on YouTube
                            </a>
                        </div>
                    ) : (
                        <div>
                            <iframe
                                src={`https://www.youtube.com/embed/${video.platformId}`}
                                title="YouTube video"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                                className="w-full aspect-video"
                            />

                            <p>
                                Having trouble?{' '}
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                    Watch on YouTube
                                </a>
                            </p>
                        </div>
                    )}
                </section>

                <section className="flex flex-col gap-4 items-center @[650px]:overflow-y-auto @[650px]:h-[450px]">
                    {previousVideos.length === 0 ? (
                        <p>Nothing before this video.</p>
                    ) : (
                        previousVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                playlistId={id}
                                video={video}
                                className="w-70 min-h-[230px] @[650px]:w-[220px] @[650px]:min-h-[200px]"
                            />
                        ))
                    )}
                    <VideoCard
                        key={video.id}
                        playlistId={id}
                        video={video}
                        className="w-72 min-h-[230px] @[650px]:w-[210px] @[650px]:min-h-[180px] border-2 border-primary ring-5 ring-primary/40 shadow-lg p-2"
                    />
                    {nextVideos.length === 0 ? (
                        <p>No more videos in this playlist.</p>
                    ) : (
                        nextVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                playlistId={id}
                                video={video}
                                className="w-70 min-h-[230px] @[650px]:w-[220px] @[650px]:min-h-[200px]"
                            />
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}
