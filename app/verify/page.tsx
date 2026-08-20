'use client';
import { schemas } from '@/api/zod';
import { AppBrand } from '../components/AppBrand';
import { AuthCard } from '../components/AuthCard';
import { ValidatedForm } from '../components/ValidatedForm';
import { Button } from '@/components/ui/button';
import { AuthLayout } from '../components/AuthLayout';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const requiredFields = new Set(['email', 'password', 'username']);
const codeInputBoxStyle = 'size-12 rounded-md border text-xl';
export default function Register() {
    return (
        <AuthLayout>
            <AppBrand showTagline={false} />
            <AuthCard className="flex flex-col items-center">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-semibold">Verification code</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter the 6-digit code sent to your email.
                    </p>
                </div>

                <ValidatedForm
                    schema={schemas.postApiauthregister_Body}
                    onValidSubmit={(data) => console.log('validated')}
                    requiredFields={requiredFields}
                >
                    <div className="flex flex-col items-center gap-6">
                        <InputOTP maxLength={6}>
                            <InputOTPGroup className="gap-1">
                                <InputOTPSlot index={0} className={codeInputBoxStyle} />
                                <InputOTPSlot index={1} className={codeInputBoxStyle} />
                                <InputOTPSlot index={2} className={codeInputBoxStyle} />
                                <InputOTPSlot index={3} className={codeInputBoxStyle} />
                                <InputOTPSlot index={4} className={codeInputBoxStyle} />
                                <InputOTPSlot index={5} className={codeInputBoxStyle} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                </ValidatedForm>
            </AuthCard>
            <p className="text-sm text-muted-foreground">
                Having trouble?{' '}
                <Link href="/login" className="font-medium text-link hover:underline">
                    New code
                </Link>
            </p>
        </AuthLayout>
    );
}
