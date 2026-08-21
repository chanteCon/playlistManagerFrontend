'use client';

import { schemas } from '@/api/zod';
import { Button } from '@/components/ui/button';

import { FormField } from '@/components/forms/FormField';
import { PasswordInput } from '@/components/forms/PasswordInput';
import { ValidatedForm } from '@/components/forms/ValidatedForm';

import Link from 'next/link';
import { AuthLayout } from '../../../layouts/AuthLayout';

const requiredFields = new Set(['email', 'password']);

export default function Login() {
    return (
        <>
            <AuthLayout>
                <ValidatedForm
                    schema={schemas.postApiauthlogin_Body}
                    onValidSubmit={(data) => alert(data)}
                    requiredFields={requiredFields}
                >
                    <FormField id="email" label="Email" type="email" />
                    <PasswordInput id="password" />
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-link hover:underline"
                        >
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
