'use client';
import CodeForm from '@/components/forms/codeForm';
import { loginMFA } from '@/requests/authRequests';
import { codeSchema } from '@/schemas/authSchemas';
import { useMutation } from '@tanstack/react-query';

export default function LoginMfa() {
    const loginMFAMutation = useMutation({
        mutationFn: loginMFA,
        onSuccess: () => {
            alert('logged in');
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
        />
    );
}
