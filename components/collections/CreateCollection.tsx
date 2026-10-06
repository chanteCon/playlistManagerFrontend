import { FolderPlus } from 'lucide-react';

export default function CreateCollection({ onCreate }: { onCreate: () => void }) {
    return (
        <button
            type="button"
            onClick={onCreate}
            className="group flex h-[120px] min-w-0 cursor-pointer flex-col items-center gap-2"
        >
            <FolderPlus
                className="h-16 w-16 text-muted-foreground transition-all group-hover:scale-105 group-hover:text-primary sm:h-20 sm:w-20"
                strokeWidth={1.5}
            />

            <div className="w-full text-center">
                <p className="truncate font-semibold text-muted-foreground transition-colors group-hover:text-primary">
                    Create collection
                </p>
            </div>
        </button>
    );
}
