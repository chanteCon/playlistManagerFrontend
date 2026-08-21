'use client';
import { codeSchema } from '@/schemas/authSchemas';
import CodeForm from '../../../../components/forms/codeForm';
import { useMutation } from '@tanstack/react-query';
import { verify } from '@/requests/authRequests';

export default function Verify() {
    const verifyMutation = useMutation({
        mutationFn: verify,

        onSuccess: () => {
            alert('Verified and logged in');
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
        />
    );
}
