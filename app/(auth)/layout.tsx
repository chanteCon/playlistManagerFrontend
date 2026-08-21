export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="flex w-full max-w-md flex-col items-center gap-6">{children}</div>
        </main>
    );
}
