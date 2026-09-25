import { cn } from '@/lib/utils';
import { Video } from '@/types';
import { PlaySquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type VideoCardProps = {
    playlistId: string;
    video: Video;
    children?: React.ReactNode;
    className?: string;
    interactive: boolean;
};

export default function VideoCard({
    video,
    children,
    playlistId,
    className,
    interactive,
}: VideoCardProps) {
    const content = (
        <>
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b bg-muted">
                {video.thumbnail ? (
                    <Image
                        src={video.thumbnail}
                        alt={video.title || 'External video'}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-[1.02]"
                    />
                ) : (
                    <PlaySquare className="h-13 w-13 text-muted-foreground" />
                )}
            </div>

            <div className="h-[75px] px-3 pb-6 pt-1">
                {video.title || video.description ? (
                    <>
                        <h3 className="truncate font-semibold">
                            {video.title || 'Untitled video'}
                        </h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                            {video.description || 'No description'}
                        </p>
                    </>
                ) : (
                    <div className="truncate text-sm">
                        <h3 className="truncate font-semibold">Preview unavailable</h3>
                        <p className="text-muted-foreground">Source: {video.url}</p>
                    </div>
                )}
            </div>
        </>
    );
    return (
        <div
            className={cn(
                'group relative h-[200px] w-[220px] overflow-hidden rounded-sm border bg-card transition-shadow hover:shadow-sm',
                className,
            )}
            key={video.id}
        >
            {interactive ? (
                <Link
                    href={`/playlist/${playlistId}/watch/${video.id}`}
                    className="flex flex-1 flex-col"
                >
                    {content}
                </Link>
            ) : (
                <div className="flex flex-1 flex-col">{content}</div>
            )}
            {children}
        </div>
    );
}
