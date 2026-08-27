import { Playlist } from '@/types';
import { PlaylistCard } from './PlaylistCard';
import { AppDropDown } from '@/components/AppDropdown';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
    Music,
    Gamepad2,
    BookOpen,
    Palette,
    Dumbbell,
    ChefHat,
    Plane,
    Camera,
    GraduationCap,
    Shapes,
} from 'lucide-react';

const playlistIcons = [
    Music,
    Gamepad2,
    BookOpen,
    Palette,
    Dumbbell,
    ChefHat,
    Plane,
    Camera,
    GraduationCap,
    Shapes,
];

type PlaylistGridProps = {
    playlists: Playlist[];
    onEdit: (playlist: Playlist) => void;
    onDelete: (playlistId: string) => void;
};

export function PlaylistGrid({ playlists, onEdit, onDelete }: PlaylistGridProps) {
    if (playlists.length === 0) {
        return (
            <p className="text-muted-foreground">
                No playlists yet. Create a playlist to start adding videos.
            </p>
        );
    }

    return (
        <section className="w-full max-w-[960px]">
            <h2 className="mb-4 text-lg font-semibold">Your playlists</h2>

            <div className="mx-auto grid w-fit max-w-full grid-cols-[repeat(auto-fill,220px)] justify-start gap-6">
                {playlists.map((playlist, index) => {
                    const PlaylistIcon = playlistIcons[index % playlistIcons.length];

                    return (
                        <PlaylistCard
                            key={playlist.id}
                            PlaylistIcon={PlaylistIcon}
                            playlist={playlist}
                        >
                            <AppDropDown>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => onEdit(playlist)}
                                >
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    variant="destructive"
                                    onClick={() => onDelete(playlist.id)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </AppDropDown>
                        </PlaylistCard>
                    );
                })}
            </div>
        </section>
    );
}
