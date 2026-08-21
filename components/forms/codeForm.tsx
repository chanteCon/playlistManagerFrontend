'use client';
import { InputOTP } from '@/components/ui/input-otp';
import { z } from 'zod';
import { ValidatedForm } from './ValidatedForm';
import { useEffect, useRef, useState } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import CodeInput from '../codeInput';
import CodeExpiry from '../auth/CodeExpiry';

const codeInputBoxStyle = 'size-12 rounded-md border text-xl';
const CODE_EXPIRY = 5 * 60;

type CodeFormParams<T extends z.ZodType> = {
    schema: T;
    onValidSubmit: (data: z.infer<T>) => void | Promise<void>;
    title: string;
    instructions?: string;
};

export default function CodeForm<T extends z.ZodType>({
    schema,
    onValidSubmit,
    title,
    instructions = 'Enter the 6-digit code sent to your email',
}: CodeFormParams<T>) {
    const formRef = useRef<HTMLFormElement>(null);
    const submitTimeout = useRef<NodeJS.Timeout | null>(null);

    const [secondsLeft, setSecondsLeft] = useState(CODE_EXPIRY);

    useEffect(() => {
        if (secondsLeft <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setSecondsLeft((current) => current - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [secondsLeft]);

    return (
        <>
            <AuthLayout showTagline={false}>
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
                            <CodeInput boxStyle={codeInputBoxStyle} />
                        </InputOTP>

                        <CodeExpiry />
                    </div>
                </ValidatedForm>
            </AuthLayout>
        </>
    );
}
