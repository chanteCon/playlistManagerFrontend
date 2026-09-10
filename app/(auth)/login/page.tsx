'use client';

import { schemas } from '@/api/zod';
import { Button } from '@/components/ui/button';

import { FormField } from '@/components/forms/FormField';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { ValidatedForm } from '@/components/forms/ValidatedForm';

import Link from 'next/link';
import { AuthLayout } from '../../../layouts/AuthLayout';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/requests/publicRequests';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServerErrors } from '@/hooks/useServerErrors';
import { hasErrorStatus, isHandledError } from '@/lib/utils';

const requiredFields = new Set(['email', 'password']);

export default function Login() {
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push('/login-mfa');
        },

        onError: (error) => {
            setRejectedReq(true);
            if (hasErrorStatus(error, 400)) {
                setServerErrors(error.fieldErrors);
            }
            if (hasErrorStatus(error, 401)) {
                setServerErrors({ email: error.message, password: error.message });
            }
        },
        throwOnError: (error) => {
            return !isHandledError(error, [400, 401]);
        },
    });

    const requestNewCode = () => {
        router.push('/request-verification');
    };

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rejectedReq, setRejectedReq] = useState(false);

    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={schemas.postApiauthlogin_Body}
                    onValidSubmit={(data) => loginMutation.mutate(data)}
                    requiredFields={requiredFields}
                    serverErrors={serverErrors}
                    onClearServerError={clearServerError}
                >
                    <FormField id="email" label="Email" type="email" />
                    <PasswordInput
                        id="password"
                        label="password"
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        onToggleShowPassword={() => setShowPassword((current) => !current)}
                    />
                    {rejectedReq && (
                        <div className="text-center text-sm">
                            <Button
                                type="button"
                                variant="link"
                                className="text-link"
                                onClick={requestNewCode}
                            >
                                Having trouble? Resend verification email
                            </Button>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <Link href="/forgot-password" className=" text-link hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </ValidatedForm>
            </AuthLayout>

            <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-link hover:underline">
                    Sign up
                </Link>
            </p>
        </>
    );
}
