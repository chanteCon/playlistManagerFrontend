'use client';
import Link from 'next/link';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { passwordResetCode } from '@/requests/authRequests';
import { useRouter } from 'next/navigation';
import { EmailCodeForm } from '@/components/forms/EmailCodeForm';

const schema = z.object({
    email: z.string().email(),
});
export default function ForgotPassword() {
    const router = useRouter();

    const reqPasswordCodeMutation = useMutation({
        mutationFn: passwordResetCode,
        onSuccess: () => {
            alert('Code requested');
            router.push('/password-reset');
        },
        onError: (error) => {
            alert(error);
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
            schema={schema}
            onSubmit={(data) => reqPasswordCodeMutation.mutate(data)}
            footer={footer}
        />
    );
}
