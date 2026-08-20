'use client';
import { schemas } from '@/api/zod';
import { AppBrand } from '../components/AppBrand';
import { AuthCard } from '../components/AuthCard';
import { ValidatedForm } from '../components/ValidatedForm';
import { FormField } from '../components/FormField';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '../components/AuthLayout';
import Link from 'next/link';

const requiredFields = new Set(['email', 'password', 'username']);
export default function Register() {
    return (
        <AuthLayout>
            <AppBrand />
            <AuthCard>
                <ValidatedForm
                    schema={schemas.postApiauthregister_Body}
                    onValidSubmit={(data) => console.log('validated')}
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
        </AuthLayout>
    );
}
