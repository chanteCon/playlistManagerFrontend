'use client';
import Link from 'next/link';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { EmailCodeForm } from '@/components/forms/EmailCodeForm';
import { hasErrorStatus } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';
import { useProfile } from '@/hooks/useProfile';

const schema = z.object({
    email: z.string().email(),
});
export default function ForgotPassword() {
    const { reqPasswordCodeMutation } = useProfile();
    const router = useRouter();
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();

    const handlePasswordResetReq = ({ email }: { email: string }) => {
        reqPasswordCodeMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    router.push('/password-reset');
                },
                onError: (error: unknown) => {
                    if (hasErrorStatus(error, 400)) {
                        setServerErrors(error.fieldErrors);
                    }
                },
            },
        );
    };

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
            onSubmit={(data) => handlePasswordResetReq(data)}
            footer={footer}
            onClearServerError={clearServerError}
            isPending={reqPasswordCodeMutation.isPending}
        />
    );
}
