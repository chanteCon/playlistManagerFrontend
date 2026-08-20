'use client';
import { AppBrand } from '../components/AppBrand';
import { AuthCard } from '../components/AuthCard';
import { AuthLayout } from '../components/AuthLayout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { z } from 'zod';
import { ValidatedForm } from './ValidatedForm';
import { useRef } from 'react';

const codeInputBoxStyle = 'size-12 rounded-md border text-xl';

type CodeLayoutParams<T extends z.ZodType> = {
    schema: T;
    onValidSubmit: (data: z.infer<T>) => void | Promise<void>;
    title: string;
    instructions?: string;
};

export default function CodeInputLayout<T extends z.ZodType>({
    schema,
    onValidSubmit,
    title,
    instructions = 'Enter the 6-digit code sent to your email',
}: CodeLayoutParams<T>) {
    const formRef = useRef<HTMLFormElement>(null);
    const submitTimeout = useRef<NodeJS.Timeout | null>(null);
    return (
        <AuthLayout>
            <AppBrand showTagline={false} />

            <AuthCard className="flex flex-col items-center">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-semibold">{title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{instructions}</p>
                </div>

                <ValidatedForm
                    formRef={formRef}
                    schema={schema}
                    onValidSubmit={onValidSubmit}
                    requiredFields={new Set(['code'])}
                >
                    <div className="flex flex-col items-center gap-6">
                        <InputOTP
                            name="code"
                            maxLength={6}
                            onChange={(value) => {
                                if (submitTimeout.current) {
                                    clearTimeout(submitTimeout.current);
                                }

                                if (value.length === 6) {
                                    submitTimeout.current = setTimeout(() => {
                                        formRef.current?.requestSubmit();
                                    }, 400);
                                }
                            }}
                        >
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
        </AuthLayout>
    );
}
