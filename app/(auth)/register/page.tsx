'use client';
import { schemas } from '@/api/zod';
import { ValidatedForm } from '../../../components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { register } from '@/requests/publicRequests';
import { PasswordFields } from '@/components/auth/PasswordFields';
import z from 'zod';
import { isHandledError } from '@/lib/utils';
import { useServerErrors } from '@/hooks/useServerErrors';

const requiredFields = new Set(['email', 'password', 'username']);

const registerSchema = schemas.postApiauthregister_Body
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function Register() {
    const {
        setErrors: setServerErrors,
        clearError: clearServerErrors,
        errors: serverErrors,
    } = useServerErrors();
    const router = useRouter();
    const registerMutation = useMutation({
        mutationFn: register,

        onSuccess: () => {
            router.push('/verify');
        },

        onError: (error) => {
            if (isHandledError(error, [400, 409])) {
                setServerErrors(error.fieldErrors);
            }
        },
        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400, 409]);
        },
    });

    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={registerSchema}
                    onValidSubmit={(data) => {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const { confirmPassword, ...requestData } = data;
                        registerMutation.mutate(requestData);
                    }}
                    requiredFields={requiredFields}
                    onClearServerError={clearServerErrors}
                    serverErrors={serverErrors}
                >
                    <FormField id="username" label="Username" type="text" />
                    <FormField id="email" label="Email" type="email" />
                    <PasswordFields />
                    <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? 'Signing up...' : 'Register'}
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
