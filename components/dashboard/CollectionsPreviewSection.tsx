import { CollectionSummary } from '@/types';
import { useRouter } from 'next/navigation';
import CreateCollection from '../collections/CreateCollection';
import { Card } from '../ui/card';
import { CollectionCard } from '../collections/CollectionsCard';

export default function CollectionsPreviewSection({
    isLoading,
    collections,
    onCreate,
}: {
    isLoading: boolean;
    collections: CollectionSummary[];
    onCreate: () => void;
}) {
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    if (collections.length === 0) {
        return (
            <section className="w-full">
                <h2 className="mb-6 text-lg font-semibold">Your collections</h2>
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                    <CreateCollection onCreate={onCreate} />
                    <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                        Create a collection to start organising your playlists.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <Card className="mb-12 p-5 pb-10">
            <div className="mb-5 flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Recent collections</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Use collections to group playlists.
                    </p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium hover:underline cursor-pointer"
                    onClick={() => router.push('/collection')}
                >
                    See all
                </button>
            </div>

            <div className="grid max-h-[360px] md:max-h-[150px] grid-cols-[repeat(auto-fill,185px)] justify-center md:gap-y-15 gap-2 overflow-hidden">
                <CreateCollection onCreate={onCreate} />
                {collections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection}>
                        <p />
                    </CollectionCard>
                ))}
            </div>
        </Card>
    );
}
