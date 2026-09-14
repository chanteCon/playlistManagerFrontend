'use client';
import { codeSchema } from '@/schemas/authSchemas';
import CodeForm from '../../../../components/forms/codeForm';
import { useMutation } from '@tanstack/react-query';
import { verify } from '@/requests/publicRequests';
import { useAuth } from '@/contexts/AuthContext';
import { extractAccessToken, isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';

export default function Verify() {
    const { updateAccessToken } = useAuth();
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();

    const verifyMutation = useMutation({
        mutationFn: verify,

        onSuccess: (res) => {
            updateAccessToken(extractAccessToken(res));
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
