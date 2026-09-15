'use client';
import { useMutation } from '@tanstack/react-query';
import { passwordReset } from '@/requests/publicRequests';
import { useRouter, useSearchParams } from 'next/navigation';
import { schemas } from '@/api/zod';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import CodeInput from '@/components/auth/codeInput';
import { Button } from '@/components/ui/button';
import { InputOTP } from '@/components/ui/input-otp';
import { AppBrand } from '@/components/common/AppBrand';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordFields } from '@/components/auth/PasswordFields';
import z from 'zod';
import CodeExpiry from '@/components/auth/CodeExpiry';
import Link from 'next/link';
import { useServerErrors } from '@/hooks/useServerErrors';
import { isHandledError } from '@/lib/utils';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const codeInputBoxStyle = 'size-12 rounded-md border text-xl';
const PASSWORD_ERROR =
    'Password must contain an uppercase letter, lowercase letter, number, and special character';

const passwordResetFormSchema = schemas.patchApiauthpasswordReset_Body
    .omit({ password: true })
    .extend({
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .max(128, 'Password must be at most 128 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,}$/,
                PASSWORD_ERROR,
            ),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function Verify() {
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerError,
    } = useServerErrors();
    const router = useRouter();

    const { clearAccessToken } = useAuth();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('logout') === 'true') {
            clearAccessToken();
            router.replace('/password-reset');
        }
    }, [searchParams, clearAccessToken, router]);

    const passwordResetMutation = useMutation({
        mutationFn: passwordReset,
        onSuccess: () => {
            router.push('/login');
        },
        onError: (error: unknown) => {
            if (isHandledError(error, [400, 401])) {
                setServerErrors(error.fieldErrors);
            }
        },

        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400, 401]);
        },
    });

    return (
        <>
            <AppBrand showTagline={false} />
            <ValidatedForm
                schema={passwordResetFormSchema}
                onValidSubmit={(data) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { confirmPassword, ...requestData } = data;
                    passwordResetMutation.mutate(requestData);
                }}
                requiredFields={new Set(['code', 'password'])}
                serverErrors={serverErrors}
                onClearServerError={clearServerError}
            >
                <AuthCard className="space-y-5">
                    <div className="space-y-3 text-center">
                        <div>
                            <h1 className="text-xl font-semibold">Reset your password</h1>
                            <p className="text-sm text-muted-foreground">
                                Enter the 6-digit code we sent to your email.
                            </p>
                        </div>
                        <InputOTP name="code" maxLength={6}>
                            <CodeInput boxStyle={codeInputBoxStyle} />
                        </InputOTP>
                        <CodeExpiry />
                        <Link className="text-link" href="/forgot-password">
                            Didn&apos;t receive the code? Try again
                        </Link>
                    </div>
                </AuthCard>
                <AuthCard className="space-y-5">
                    <PasswordFields />

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={passwordResetMutation.isPending}
                    >
                        {passwordResetMutation.isPending
                            ? 'Resetting password...'
                            : 'Reset password'}
                    </Button>
                </AuthCard>
            </ValidatedForm>
        </>
    );
}
