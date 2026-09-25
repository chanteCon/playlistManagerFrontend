import { Playlist, Video } from '@/types';
import { VideoGridSkeleton } from '../skeletons/VideoGridSkeleton';
import AddCard from '../common/AddCard';
import VideoCard from './VideoCard';
import ActionsDropDown from '../common/ActionsDropDown';
import SortableVideoGrid from './SortableVideoGrid';

type VideoGridProps = {
    isLoading: boolean;
    playlist: Playlist | undefined;
    onEdit: (video: Video) => void;
    onDelete: (video: Video) => void;
    setIsAddVideoOpen: (arg0: boolean) => void;
    editingPlaylist: boolean;
    onSelectCover: (video: Video) => void;
    coverPending: boolean;
    editingOrder: boolean;
    handleSave: () => void;
};

export default function VideoGrid({
    isLoading,
    playlist,
    onEdit,
    onDelete,
    setIsAddVideoOpen,
    editingPlaylist,
    onSelectCover,
    coverPending,
    editingOrder,
    handleSave,
}: VideoGridProps) {
    const sortedVideos = [...(playlist?.videos ?? [])].sort((a, b) => a.position - b.position);
    return (
        <>
            {isLoading ? (
                <VideoGridSkeleton />
            ) : (
                <>
                    {playlist?.videos?.length === 0 && (
                        <p className="mt-2 text-sm text-muted-foreground">
                            No videos in this playlist yet.
                        </p>
                    )}

                    {editingOrder && playlist ? (
                        <SortableVideoGrid playlist={playlist} handleSave={handleSave} />
                    ) : (
                        <div className="grid w-fit w-full grid-cols-[repeat(auto-fill,220px)] justify-center gap-6">
                            {!editingPlaylist && (
                                <AddCard
                                    className="h-[200px] w-[220px] rounded-sm border"
                                    setDialogOpen={setIsAddVideoOpen}
                                    message="Add video"
                                />
                            )}
                            {playlist &&
                                sortedVideos.map((video) =>
                                    editingPlaylist ? (
                                        <button
                                            key={video.id}
                                            type="button"
                                            className="group relative h-[200px] w-[220px] cursor-pointer overflow-hidden rounded-sm border-3 border-dashed border-secondary transition-all hover:border-primary hover:ring-2 hover:ring-primary/30"
                                            onClick={() => onSelectCover(video)}
                                            disabled={coverPending}
                                        >
                                            <VideoCard
                                                video={video}
                                                playlistId={playlist.id}
                                                interactive={false}
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                <span className="font-medium text-white">
                                                    {coverPending
                                                        ? 'Cover updating...'
                                                        : 'Use as cover'}
                                                </span>
                                            </div>
                                        </button>
                                    ) : (
                                        <VideoCard
                                            key={video.id}
                                            video={video}
                                            playlistId={playlist.id}
                                            interactive={true}
                                        >
                                            <ActionsDropDown
                                                className="border border-white bg-black/40 text-white opacity-100"
                                                onEdit={() => onEdit(video)}
                                                onDelete={() => onDelete(video)}
                                            />
                                        </VideoCard>
                                    ),
                                )}
                        </div>
                    )}
                </>
            )}
        </>
    );
}
