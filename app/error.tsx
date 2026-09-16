'use client';

import { hasErrorStatus, isRequestError } from '@/lib/utils';

type ErrorPageProps = {
    error: Error & { status?: number; digest?: string };
    reset: () => void;
};

export default function ErrorPage({ error }: ErrorPageProps) {
    return (
        <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-16 text-center">
            <p className="mt-3 text-muted-foreground">
                {hasErrorStatus(error, 429)
                    ? 'Too many requests. Please try again later'
                    : isRequestError(error)
                      ? error.message
                      : 'Something went wrong while processing your request.'}
            </p>
        </main>
    );
}
