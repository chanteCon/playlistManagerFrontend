'use client';
import { useMutation } from '@tanstack/react-query';
import { passwordReset } from '@/requests/authRequests';
import { useRouter } from 'next/navigation';
import { schemas } from '@/api/zod';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import CodeInput from '@/components/codeInput';
import { Button } from '@/components/ui/button';
import { InputOTP } from '@/components/ui/input-otp';
import { AppBrand } from '@/components/AppBrand';
import { AuthCard } from '@/components/auth/AuthCard';
import { PasswordFields } from '@/components/auth/PasswordFields';
import z from 'zod';
import CodeExpiry from '@/components/auth/CodeExpiry';

const codeInputBoxStyle = 'size-12 rounded-md border text-xl';

const passwordResetFormSchema = schemas.patchApiauthpasswordReset_Body
    .extend({
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export default function Verify() {
    const router = useRouter();

    const passwordResetMutation = useMutation({
        mutationFn: passwordReset,
        onSuccess: () => {
            alert('success');
            router.push('/login');
        },
        onError: (error) => {
            alert(error);
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
            >
                <AuthCard className="space-y-5">
                    <div className="space-y-3 text-center">
                        <div>
                            <p className="text-sm font-medium">Verification code</p>
                            <p className="text-sm text-muted-foreground">
                                Enter the 6-digit code we sent to your email.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <InputOTP name="code" maxLength={6}>
                                <CodeInput boxStyle={codeInputBoxStyle} />
                            </InputOTP>
                        </div>
                        <CodeExpiry />
                    </div>
                </AuthCard>
                <AuthCard className="space-y-5">
                    <PasswordFields />
                    <Button className="w-full" type="submit">
                        Reset password
                    </Button>
                </AuthCard>
            </ValidatedForm>
        </>
    );
}
