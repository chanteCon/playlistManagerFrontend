import { PlaylistSummary } from '@/types';
import { Card } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

type PlaylistCardProps = {
    PlaylistIcon: LucideIcon;
    playlist: PlaylistSummary;
    children: React.ReactNode;
};
export function PlaylistCard({ PlaylistIcon, playlist, children }: PlaylistCardProps) {
    return (
        <Card className="group relative h-[220px] w-[220px] overflow-hidden rounded-sm border bg-card p-0 transition-shadow hover:shadow-sm">
            <Link href={`/playlist/${playlist.id}`} className="flex flex-1 flex-col">
                <div className="relative flex flex-1 items-center justify-center border-b">
                    {playlist.coverUrl ? (
                        <img
                            src={playlist.coverUrl}
                            alt={`${playlist.name} cover`}
                            className="absolute inset-0 h-full w-full rounded-t-sm object-cover"
                        />
                    ) : (
                        <PlaylistIcon className="h-20 w-20 text-muted-foreground" />
                    )}
                </div>
                <div className="h-[50px] shrink-0 px-3">
                    <h2 className="truncate font-semibold">{playlist.name}</h2>

                    <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <p className="truncate">{playlist.description || 'No description'}</p>

                        <span className="shrink-0">
                            {playlist.numVideos} {playlist.numVideos === 1 ? 'video' : 'videos'}
                        </span>
                    </div>
                </div>
            </Link>
            {children}
        </Card>
    );
}
