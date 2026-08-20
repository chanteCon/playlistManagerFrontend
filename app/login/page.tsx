'use client';

import { schemas } from '@/api/zod';
import { Button } from '@/components/ui/button';

import { FormField } from '../components/FormField';
import { PasswordInput } from '../components/PasswordInput';
import { ValidatedForm } from '../components/ValidatedForm';

import { handleSubmit } from './actions';
const requiredFields = new Set(['email', 'password']);
import { AuthCard } from '../components/AuthCard';
import Link from 'next/link';
import { AppBrand } from '../components/AppBrand';

export default function Login() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="flex w-full max-w-md flex-col items-center gap-6">
                <AppBrand />

                <AuthCard>
                    <ValidatedForm
                        schema={schemas.postApiauthlogin_Body}
                        onValidSubmit={(data) => handleSubmit(data)}
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
                </AuthCard>

                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-medium text-link hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}
