'use client';
import Link from 'next/link';
import { Folder } from 'lucide-react';
import { CollectionSummary } from '@/types';
type CollectionCardProps = { collection: CollectionSummary; children: React.ReactNode };
const folderColour = 'text-muted-foreground';
export function CollectionCard({ collection, children }: CollectionCardProps) {
    return (
        <div className="group relative flex h-[120px] min-w-0">
            <Link
                href={`/collection/${collection.id}`}
                className="flex w-full flex-col items-center gap-2"
            >
                <Folder
                    className={`h-16 w-16 fill-current ${folderColour} transition-transform group-hover:scale-105 sm:h-20 sm:w-20`}
                    strokeWidth={1.5}
                />
                <div className="w-full text-center">
                    <h2 className="truncate "> {collection.name} </h2>
                </div>
            </Link>
            {children}
        </div>
    );
}
