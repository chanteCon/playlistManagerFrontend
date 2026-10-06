import { PlaylistSummary } from '@/types';
import { Music, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/card';
import AddCard from '../common/AddCard';
import { PlaylistCard } from '../playlists/PlaylistCard';

export default function PlaylistPreviewSection({
    isLoading,
    playlists,
    onCreate,
}: {
    isLoading: boolean;
    playlists: PlaylistSummary[];
    onCreate: () => void;
}) {
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    if (playlists.length === 0) {
        return (
            <section className="w-full m-5 ">
                <h2 className="mb-6 text-lg font-semibold">Your playlists</h2>
                <button onClick={onCreate} className="w-full cursor-pointer hover:text-primary">
                    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                        <Plus />
                        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                            Create a playlist to start organising videos.
                        </p>
                    </div>
                </button>
            </section>
        );
    }

    return (
        <Card className="mb-12 mt-12 p-5 pb-20">
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Recent playlists</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Your latest playlists.</p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium hover:underline cursor-pointer"
                    onClick={() => router.push('/playlist')}
                >
                    See all
                </button>
            </div>

            <div className="grid max-h-[650px] md:max-h-[440px] grid-cols-[repeat(auto-fill,220px)] gap-6 gap-x-3 overflow-hidden justify-center">
                <div className="w-[220px]">
                    <AddCard
                        className="h-[200px] w-[200px] rounded-sm border"
                        setDialogOpen={onCreate}
                        message="New Playlist"
                    />
                </div>

                {playlists.map((playlist) => (
                    <div key={playlist.id}>
                        <PlaylistCard playlist={playlist} PlaylistIcon={Music}>
                            <p />
                        </PlaylistCard>
                    </div>
                ))}
            </div>
        </Card>
    );
}
