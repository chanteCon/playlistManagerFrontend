'use client';
import Link from 'next/link';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { verificationCode } from '@/requests/authRequests';
import { useRouter } from 'next/navigation';
import { EmailCodeForm } from '@/components/forms/EmailCodeForm';

const schema = z.object({
    email: z.string().email(),
});
export default function RequestCode() {
    const router = useRouter();

    const reqCodeMutation = useMutation({
        mutationFn: verificationCode,
        onSuccess: () => {
            alert('Code requested');
            router.push('/verify');
        },
        onError: (error) => {
            alert(error);
        },
    });

    const footer = (
        <p className="text-sm text-muted-foreground">
            Already verified?{' '}
            <Link href="/login" className="font-medium text-link hover:underline">
                Login
            </Link>
        </p>
    );
    return (
        <EmailCodeForm
            schema={schema}
            onSubmit={(data) => reqCodeMutation.mutate(data)}
            footer={footer}
        />
    );
}
