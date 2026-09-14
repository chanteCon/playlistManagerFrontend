import { Skeleton } from '../ui/skeleton';

export function PlaylistGridSkeleton() {
    return (
        <section className="w-full max-w-[960px]">
            <Skeleton className="mb-4 h-6 w-40 rounded bg-muted" />

            <div className="mx-auto grid w-fit max-w-full grid-cols-[repeat(auto-fill,220px)] justify-start gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-[220px] w-[220px]  rounded-sm bg-muted" />
                ))}
            </div>
        </section>
    );
}
