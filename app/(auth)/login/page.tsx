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

const requiredFields = new Set(['email', 'password']);

export default function Login() {
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: () => {
            router.push('/login-mfa');
        },

        onError: (error) => {
            console.error(error);
            setRejected(true);
        },
    });

    const [rejected, setRejected] = useState(false);

    const requestNewCode = () => {
        alert('New code requested');
        router.push('/request-verification');
    };

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={schemas.postApiauthlogin_Body}
                    onValidSubmit={(data) => loginMutation.mutate(data)}
                    requiredFields={requiredFields}
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
                    {rejected && (
                        <div className="text-center text-sm">
                            <p className="text-destructive">Invalid email or password.</p>

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
