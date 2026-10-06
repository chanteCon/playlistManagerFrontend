import { PlaylistSummary } from '@/types';
import { PlaylistCard } from './PlaylistCard';
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
import ActionsDropDown from '../common/ActionsDropDown';
import AddCard from '../common/AddCard';

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
    playlists: PlaylistSummary[];
    onEdit?: (playlist: PlaylistSummary) => void;
    onDelete?: (playlistId: string) => void;
    onCreate: () => void;
};

export function PlaylistGrid({ playlists, onEdit, onDelete, onCreate }: PlaylistGridProps) {
    return (
        <section className="mx-auto w-full max-w-[960px]">
            <div className="grid grid-cols-[repeat(auto-fill,220px)] justify-center gap-5 gap-x-1">
                <AddCard
                    className="h-[200px] w-[200px] rounded-sm border"
                    setDialogOpen={onCreate}
                    message="New Playlist"
                />

                {playlists.map((playlist, index) => {
                    const PlaylistIcon = playlistIcons[index % playlistIcons.length];

                    return (
                        <PlaylistCard
                            key={playlist.id}
                            PlaylistIcon={PlaylistIcon}
                            playlist={playlist}
                        >
                            {onEdit && onDelete && (
                                <ActionsDropDown
                                    onEdit={() => onEdit(playlist)}
                                    onDelete={() => onDelete(playlist.id)}
                                />
                            )}
                        </PlaylistCard>
                    );
                })}
            </div>
        </section>
    );
}
