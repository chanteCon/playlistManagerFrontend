'use client';
import { schemas } from '@/api/zod';
import { ValidatedForm } from '../../../components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { register } from '@/requests/authRequests';
import { PasswordFields } from '@/components/auth/PasswordFields';

const requiredFields = new Set(['email', 'password', 'username']);
export default function Register() {
    const router = useRouter();
    const registerMutation = useMutation({
        mutationFn: register,

        onSuccess: () => {
            router.push('/verify');
        },

        onError: (error) => {
            alert(error);
        },
    });
    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={schemas.postApiauthregister_Body}
                    onValidSubmit={(data) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { confirmPassword, ...requestData } = data;
                        registerMutation.mutate(requestData);
                    }}
                    requiredFields={requiredFields}
                >
                    <FormField id="username" label="Username" type="text" />
                    <FormField id="email" label="Email" type="email" />
                    <PasswordFields />
                    <Button type="submit" className="w-full">
                        Register
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
