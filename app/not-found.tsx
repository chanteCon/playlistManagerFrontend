export default function NotFound() {
    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Playlist not found</h1>

            <p className="mt-3 text-muted-foreground">
                This playlist may have been deleted or no longer exists.
            </p>
        </main>
    );
}
