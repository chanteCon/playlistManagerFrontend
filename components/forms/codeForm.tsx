'use client';
import { InputOTP } from '@/components/ui/input-otp';
import { z } from 'zod';
import { ValidatedForm } from './ValidatedForm';
import { useRef } from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import CodeInput from '../auth/codeInput';
import CodeExpiry from '../auth/CodeExpiry';
import Link from 'next/link';

const codeInputBoxStyle = 'size-12 rounded-md border text-xl';

type CodeFormParams<T extends z.ZodType> = {
    schema: T;
    onValidSubmit: (data: z.infer<T>) => void | Promise<void>;
    title: string;
    instructions?: string;
    type: 'LOGIN' | 'VERIFICATION';
    serverErrors?: Record<string, string>;
    clearServerErrors?: (field: string) => void;
};

export default function CodeForm<T extends z.ZodType>({
    schema,
    onValidSubmit,
    title,
    instructions = 'Enter the 6-digit code sent to your email',
    type,
    serverErrors,
    clearServerErrors,
}: CodeFormParams<T>) {
    const formRef = useRef<HTMLFormElement>(null);

    const resendRoutes = {
        VERIFICATION: '/request-verification',
        LOGIN: '/login',
    } as const;

    const resendRoute = resendRoutes[type];

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
                    serverErrors={serverErrors}
                    onClearServerError={clearServerErrors}
                >
                    <div className="flex flex-col items-center gap-6">
                        <InputOTP
                            name="code"
                            maxLength={6}
                            onChange={(value) => {
                                if (value.length === 6) {
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        >
                            <CodeInput boxStyle={codeInputBoxStyle} />
                        </InputOTP>

                        <CodeExpiry />
                        <Link className="text-link" href={resendRoute}>
                            Didn&apos;t receive the code? Try again
                        </Link>
                    </div>
                </ValidatedForm>
            </AuthLayout>
        </>
    );
}
