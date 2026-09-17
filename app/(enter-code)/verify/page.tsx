'use client';
import { codeSchema } from '@/schemas/authSchemas';
import CodeForm from '../../../components/forms/codeForm';
import { useMutation } from '@tanstack/react-query';
import { verify } from '@/requests/publicRequests';
import { useAuth } from '@/contexts/AuthContext';
import { extractAccessToken, isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function Verify() {
    const { updateAccessToken, clearAccessToken } = useAuth();
    const router = useRouter();

    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('logout') === 'true') {
            clearAccessToken();
            router.replace('/verify');
        }
    }, [searchParams, clearAccessToken, router]);

    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();

    const verifyMutation = useMutation({
        mutationFn: verify,

        onSuccess: (res) => {
            updateAccessToken(extractAccessToken(res));
            router.replace('/dashboard');
        },

        onError: (error: unknown) => {
            if (isHandledError(error, [400, 401])) {
                setServerErrors(error.fieldErrors);
            }
        },

        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400, 401]);
        },
    });

    return (
        <CodeForm
            title="Verification code"
            instructions="Enter the 6-digit code sent to your email"
            schema={codeSchema}
            onValidSubmit={(data) => verifyMutation.mutate(data)}
            type="VERIFICATION"
            serverErrors={serverErrors}
            clearServerErrors={clearServerError}
            isPending={verifyMutation.isPending}
        />
    );
}

export default function VerifyPage() {
    <Suspense>
        <Verify />
    </Suspense>;
}
