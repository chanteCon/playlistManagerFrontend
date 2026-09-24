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
                            className="absolute inset-0 h-full w-full rounded-md object-cover"
                        />
                    ) : (
                        <PlaylistIcon className="h-20 w-20 text-muted-foreground" />
                    )}
                </div>
                <div className="h-[50px] shrink-0 px-3">
                    <h2 className="truncate font-semibold">{playlist.name}</h2>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        {playlist.description || 'No description'}
                    </p>
                </div>
            </Link>
            {children}
        </Card>
    );
}
