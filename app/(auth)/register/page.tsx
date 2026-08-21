'use client';
import { schemas } from '@/api/zod';
import { AppBrand } from '../../components/AppBrand';
import { AuthCard } from '../../components/AuthCard';
import { ValidatedForm } from '../../components/ValidatedForm';
import { FormField } from '../../components/FormField';
import { PasswordInput } from '../../components/PasswordInput';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/createClient';
import { z } from 'zod';

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
            <AppBrand />
            <AuthCard>
                <ValidatedForm
                    schema={schemas.postApiauthregister_Body}
                    onValidSubmit={(data) => registerMutation.mutate(data)}
                    requiredFields={requiredFields}
                >
                    <FormField id="username" label="username" type="text" />
                    <FormField id="email" label="Email" type="email" />
                    <PasswordInput id="password"></PasswordInput>
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </ValidatedForm>
            </AuthCard>
            <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-link hover:underline">
                    Login
                </Link>
            </p>
        </>
    );
}
