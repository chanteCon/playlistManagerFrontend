import { Library } from 'lucide-react';

export function AppBrand() {
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Library className="size-6" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                    Playlist Manager
                </h1>
            </div>

            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                Build your personal video library from multiple platforms.
            </p>
        </div>
    );
}
