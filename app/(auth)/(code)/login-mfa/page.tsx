'use client';
import CodeForm from '@/components/forms/codeForm';
import { useAuth } from '@/contexts/AuthContext';
import { extractAccessToken, isHandledError } from '@/lib/utils';
import { loginMFA } from '@/requests/publicRequests';
import { codeSchema } from '@/schemas/authSchemas';
import { useMutation } from '@tanstack/react-query';
import { useServerErrors } from '@/hooks/useServerErrors';

export default function LoginMfa() {
    const { updateAccessToken } = useAuth();
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();
    const loginMFAMutation = useMutation({
        mutationFn: loginMFA,

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
            title="Login code"
            instructions="Enter the 6-digit code sent to your email"
            schema={codeSchema}
            onValidSubmit={loginMFAMutation.mutate}
            type="LOGIN"
            serverErrors={serverErrors}
            clearServerErrors={clearServerError}
        />
    );
}
