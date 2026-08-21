'use client';
import { schemas } from '@/api/zod';
import { ValidatedForm } from '../../../components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/createClient';
import { z } from 'zod';
import { AuthLayout } from '../../../layouts/AuthLayout';

const requiredFields = new Set(['email', 'password', 'username']);
export default function Register() {
    const router = useRouter();
    type RegisterInput = z.infer<typeof schemas.postApiauthregister_Body>;
    const registerMutation = useMutation({
        mutationFn: async (data: RegisterInput) => {
            const response = await api.POST('/api/auth/register', {
                body: data,
            });

            if (response.error) {
                alert(response.error.message);
                throw new Error(response.error.message);
            }

            return response.data;
        },

        onSuccess: () => {
            router.push('/verify');
        },

        onError: (error) => {
            console.error(error);
        },
    });
    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={schemas.postApiauthregister_Body}
                    onValidSubmit={(data) => registerMutation.mutate(data)}
                    requiredFields={requiredFields}
                >
                    <FormField id="username" label="Username" type="text" />
                    <FormField id="email" label="Email" type="email" />
                    <PasswordInput id="password" />
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
