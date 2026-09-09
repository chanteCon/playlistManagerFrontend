'use client';
import { codeSchema } from '@/schemas/authSchemas';
import CodeForm from '../../../../components/forms/codeForm';
import { useMutation } from '@tanstack/react-query';
import { verify } from '@/requests/publicRequests';
import { useAuth } from '@/contexts/AuthContext';
import { extractAccessToken } from '@/lib/utils';

export default function Verify() {
    const { updateAccessToken } = useAuth();
    const verifyMutation = useMutation({
        mutationFn: verify,

        onSuccess: (res) => {
            updateAccessToken(extractAccessToken(res));
        },

        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <CodeForm
            title="Verification code"
            instructions="Enter the 6-digit code sent to your email"
            schema={codeSchema}
            onValidSubmit={(data) => verifyMutation.mutate(data)}
            type="VERIFICATION"
        />
    );
}
