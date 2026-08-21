'use client';
import { ValidatedForm } from '../../../components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { z } from 'zod';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { useMutation } from '@tanstack/react-query';
import { passwordResetCode } from '@/requests/authRequests';
import { useRouter } from 'next/navigation';

const schema = z.object({
    email: z.string().email(),
});
const requiredFields = new Set(['email']);
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
    return (
        <>
            <AuthLayout showTagline={false}>
                <div className="mb-6 text-center">
                    <p className="mt-2 text-md">
                        Enter your email below to request a password reset code
                    </p>
                </div>
                <ValidatedForm
                    schema={schema}
                    onValidSubmit={(data) => reqPasswordCodeMutation.mutate(data)}
                    requiredFields={requiredFields}
                >
                    <FormField id="email" label="Email" type="email" />
                    <Button type="submit" className="w-full">
                        Get code
                    </Button>
                </ValidatedForm>
            </AuthLayout>
            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-link hover:underline">
                    Login
                </Link>
            </p>
        </>
    );
}
