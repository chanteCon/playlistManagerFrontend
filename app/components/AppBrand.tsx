import Link from 'next/link';
import { Library } from 'lucide-react';

type AppBrandProps = {
    showTagline?: boolean;
};

export function AppBrand({ showTagline = true }: AppBrandProps) {
    return (
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Library className="size-6" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                    Playlist Manager
                </h1>
            </Link>

            {showTagline && (
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                    Build your personal video library from multiple platforms.
                </p>
            )}
        </div>
    );
}
