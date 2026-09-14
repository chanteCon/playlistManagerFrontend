import { Playlist } from '@/types';
import { PlaylistHeaderSkeleton } from '../skeletons/PlaylistHeaderSkeleton';

export default function PlaylistHeader({
    isLoading,
    playlist,
}: {
    isLoading: boolean;
    playlist: Playlist | undefined;
}) {
    return (
        <>
            {isLoading ? (
                <PlaylistHeaderSkeleton />
            ) : (
                <section className="border-b pb-8 flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {playlist?.name ?? 'No name'}
                        </h1>

                        <p className="mt-3 max-w-2xl text-muted-foreground">
                            {playlist?.description || 'No description'}
                        </p>
                    </div>
                </section>
            )}
        </>
    );
}
