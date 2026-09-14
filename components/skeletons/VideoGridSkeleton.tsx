import { Skeleton } from '../ui/skeleton';

export function VideoGridSkeleton() {
    return (
        <div className="grid w-fit max-w-full grid-cols-[repeat(auto-fill,220px)] justify-start gap-6">
            <Skeleton className="h-[200px] w-[220px] rounded-sm bg-muted" />

            {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-[200px] w-[220px] rounded-sm bg-muted" />
            ))}
        </div>
    );
}
