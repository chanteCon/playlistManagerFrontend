import Link from 'next/link';
import { Library } from 'lucide-react';

type AppBrandProps = {
    showTagline?: boolean;
    variant?: 'default' | 'navbar';
};

export function AppBrand({ showTagline = true, variant = 'default' }: AppBrandProps) {
    const appName = 'Playlists';
    if (variant === 'navbar') {
        return (
            <Link
                href="/"
                className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
            >
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Library className="size-5" />
                </div>

                <span className="text-xl font-extrabold tracking-tight text-primary">
                    {appName}
                </span>
            </Link>
        );
    }

    return (
        <div className="flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Library className="size-6" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-primary">{appName}</h1>
            </Link>

            {showTagline && (
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                    Build your personal video library from multiple platforms.
                </p>
            )}
        </div>
    );
}
