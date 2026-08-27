import { Playlist } from '@/types';
import { Card } from '../ui/card';
import { LucideIcon } from 'lucide-react';

type PlaylistCardProps = {
    PlaylistIcon: LucideIcon;
    playlist: Playlist;
    children: React.ReactNode;
};
export function PlaylistCard({ PlaylistIcon, playlist, children }: PlaylistCardProps) {
    return (
        <Card className="flex group relative h-[220px] w-[220px] overflow-hidden rounded-sm border bg-card transition-shadow hover:shadow-sm">
            <div className="flex flex-1 items-center justify-center border-b">
                <PlaylistIcon className="h-20 w-20 text-muted-foreground" />
            </div>
            {children}
            <div className="h-[50px] shrink-0 px-3">
                <h2 className="truncate font-semibold">{playlist.name}</h2>

                <p className="mt-1 truncate text-sm text-muted-foreground">
                    {playlist.description || 'No description'}
                </p>
            </div>
        </Card>
    );
}
