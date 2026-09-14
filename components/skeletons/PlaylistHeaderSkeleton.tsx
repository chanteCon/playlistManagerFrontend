import { Skeleton } from '../ui/skeleton';

export function PlaylistHeaderSkeleton() {
    return (
        <section className="flex justify-between border-b pb-8">
            <div className="flex flex-col gap-3">
                <Skeleton className="h-9 w-64 rounded bg-muted" />
                <Skeleton className="h-5 w-96 rounded bg-muted" />
            </div>
        </section>
    );
}
