import { Playlist, Video } from '@/types';
import { VideoGridSkeleton } from '../skeletons/VideoGridSkeleton';
import AddCard from '../common/AddCard';
import VideoCard from './VideoCard';
import ActionsDropDown from '../common/ActionsDropDown';

type VideoGridProps = {
    isLoading: boolean;
    playlist: Playlist | undefined;
    onEdit: (video: Video) => void;
    onDelete: (video: Video) => void;
    setIsAddVideoOpen: (arg0: boolean) => void;
};

export default function VideoGrid({
    isLoading,
    playlist,
    onEdit,
    onDelete,
    setIsAddVideoOpen,
}: VideoGridProps) {
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

                    <div className="grid w-fit w-full grid-cols-[repeat(auto-fill,220px)] justify-center gap-6">
                        <AddCard
                            className="h-[200px] w-[220px] rounded-sm border"
                            setDialogOpen={setIsAddVideoOpen}
                            message="Add video"
                        />

                        {playlist?.videos.map((video) => (
                            <VideoCard key={video.id} video={video} playlistId={playlist.id}>
                                <ActionsDropDown
                                    className="border border-white bg-black/40 text-white"
                                    onEdit={() => onEdit(video)}
                                    onDelete={() => onDelete(video)}
                                />
                            </VideoCard>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
