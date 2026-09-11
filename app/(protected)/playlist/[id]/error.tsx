'use client';

import { hasErrorStatus } from '@/lib/utils';

type ErrorPageProps = {
    error: Error & { status?: number; digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
    const isNotFound = hasErrorStatus(error, 404);

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
                {isNotFound ? 'Playlist not found' : 'Something went wrong'}
            </h1>

            <p className="mt-3 text-muted-foreground">
                {isNotFound
                    ? 'This playlist no longer exists.'
                    : 'Something went wrong while processing your request.'}
            </p>
        </main>
    );
}
