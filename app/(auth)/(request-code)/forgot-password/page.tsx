'use client';
import Link from 'next/link';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { passwordResetCode } from '@/requests/publicRequests';
import { useRouter } from 'next/navigation';
import { EmailCodeForm } from '@/components/forms/EmailCodeForm';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';

const schema = z.object({
    email: z.string().email(),
});
export default function ForgotPassword() {
    const router = useRouter();
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();

    const reqPasswordCodeMutation = useMutation({
        mutationFn: passwordResetCode,
        onSuccess: () => {
            router.push('/password-reset');
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
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-link hover:underline">
                Login
            </Link>
        </p>
    );
    return (
        <EmailCodeForm
            serverErrors={serverErrors}
            schema={schema}
            onSubmit={(data) => reqPasswordCodeMutation.mutate(data)}
            footer={footer}
            onClearServerError={clearServerError}
            isPending={reqPasswordCodeMutation.isPending}
        />
    );
}
