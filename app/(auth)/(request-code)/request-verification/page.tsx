'use client';
import Link from 'next/link';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { verificationCode } from '@/requests/publicRequests';
import { useRouter } from 'next/navigation';
import { EmailCodeForm } from '@/components/forms/EmailCodeForm';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';

const schema = z.object({
    email: z.string().email(),
});
export default function RequestCode() {
    const router = useRouter();
    const {
        errors: serverErrors,
        clearError: clearServerError,
        setErrors: setServerErrors,
    } = useServerErrors();

    const reqCodeMutation = useMutation({
        mutationFn: verificationCode,
        onSuccess: () => {
            router.push('/verify');
        },
        onError: (error: unknown) => {
            if (hasErrorStatus(error, 400)) {
                setServerErrors(error.fieldErrors);
            }
        },

        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400]);
        },
    });

    const footer = (
        <p className="text-sm text-muted-foreground">
            Already verified?{' '}
            <Link href="/login" className="font-medium text-link hover:underline">
                Login
            </Link>
        </p>
    );
    return (
        <EmailCodeForm
            schema={schema}
            onSubmit={(data) => reqCodeMutation.mutate(data)}
            footer={footer}
            serverErrors={serverErrors}
            onClearServerError={clearServerError}
            isPending={reqCodeMutation.isPending}
        />
    );
}
