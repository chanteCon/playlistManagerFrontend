'use client';
import { AppBrand } from '../../components/AppBrand';
import { AuthCard } from '../../components/AuthCard';
import { ValidatedForm } from '../../components/ValidatedForm';
import { FormField } from '../../components/FormField';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { z } from 'zod';

const schema = z.object({
    email: z.string().email(),
});
const requiredFields = new Set(['email']);
export default function ForgotPassword() {
    return (
        <>
            <AppBrand showTagline={false} />
            <div className="mb-6 text-center">
                <p className="mt-2 text-md">
                    Enter your email below to request a password reset code
                </p>
            </div>
            <AuthCard>
                <ValidatedForm
                    schema={schema}
                    onValidSubmit={() => alert('submitted')}
                    requiredFields={requiredFields}
                >
                    <FormField id="email" label="Email" type="email" />
                    <Button type="submit" className="w-full">
                        Get code
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
