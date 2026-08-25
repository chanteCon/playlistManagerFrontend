'use client';
import CodeForm from '@/components/forms/codeForm';
import { useAuth } from '@/contexts/AuthContext';
import { extractAccessToken } from '@/lib/utils';
import { loginMFA } from '@/requests/authRequests';
import { codeSchema } from '@/schemas/authSchemas';
import { useMutation } from '@tanstack/react-query';

export default function LoginMfa() {
    const { setAccessToken } = useAuth();
    const loginMFAMutation = useMutation({
        mutationFn: loginMFA,
        onSuccess: (res) => {
            setAccessToken(extractAccessToken(res));
        },

        onError: (error) => {
            alert(error);
        },
    });
    return (
        <CodeForm
            title="Login code"
            instructions="Enter the 6-digit code sent to your email"
            schema={codeSchema}
            onValidSubmit={loginMFAMutation.mutate}
            type="LOGIN"
        />
    );
}
