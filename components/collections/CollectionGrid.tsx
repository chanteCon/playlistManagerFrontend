import { CollectionSummary } from '@/types';

import ActionsDropDown from '../common/ActionsDropDown';
import { CollectionCard } from './CollectionsCard';
import CreateCollection from './CreateCollection';

type CollectionGridProps = {
    collections: CollectionSummary[];
    onEdit: (collection: CollectionSummary) => void;
    onDelete: (collectionId: string) => void;
    onCreate: () => void;
};

export function CollectionGrid({ collections, onEdit, onDelete, onCreate }: CollectionGridProps) {
    if (collections.length === 0) {
        return (
            <section className="w-full">
                <div className="flex min-h-[240px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
                    <CreateCollection onCreate={onCreate} />
                    <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                        Create a collection to start organising your playlists.
                    </p>
                </div>
            </section>
        );
    }
    const sortedCollections = collections.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return (
        <section className="w-full">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                <CreateCollection onCreate={onCreate} />
                {sortedCollections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection}>
                        <ActionsDropDown
                            onEdit={() => onEdit(collection)}
                            onDelete={() => onDelete(collection.id)}
                        />
                    </CollectionCard>
                ))}
            </div>
        </section>
    );
}
