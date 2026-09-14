import { PlaylistSummary } from '@/types';
import { PlaylistGridSkeleton } from '../skeletons/PlaylistGridSkeleton';
import { PlaylistGrid } from './PlaylistGrid';

export default function PlaylistSection({
    isLoading,
    playlists,
    onEdit,
    onDelete,
}: {
    isLoading: boolean;
    playlists: PlaylistSummary[];
    onEdit: (playlist: PlaylistSummary) => void;
    onDelete: (playlistId: string) => void;
}) {
    if (isLoading) {
        return <PlaylistGridSkeleton />;
    }

    if (playlists.length === 0) {
        return (
            <p className="text-muted-foreground">
                No playlists yet. Create a playlist to start adding videos.
            </p>
        );
    }

    return <PlaylistGrid playlists={playlists} onEdit={onEdit} onDelete={onDelete} />;
}
