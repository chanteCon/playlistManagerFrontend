type AuthLayoutProps = {
    children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="flex w-full max-w-md flex-col items-center gap-6">{children}</div>
        </main>
    );
}
