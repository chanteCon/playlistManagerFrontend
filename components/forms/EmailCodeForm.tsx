'use client';
import { ValidatedForm } from './ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { z } from 'zod';

const requiredFields = new Set(['email']);

type EmailCodeFormProps<T extends z.ZodType> = {
    schema: T;
    onSubmit: (data: z.infer<T>) => void;
    footer?: React.ReactNode;
    serverErrors?: Record<string, string>;
    onClearServerError?: (field: string) => void;
    isPending?: boolean;
};

export function EmailCodeForm<T extends z.ZodType>({
    schema,
    onSubmit,
    footer,
    serverErrors,
    onClearServerError,
    isPending,
}: EmailCodeFormProps<T>) {
    return (
        <>
            <ValidatedForm
                serverErrors={serverErrors}
                schema={schema}
                onValidSubmit={onSubmit}
                requiredFields={requiredFields}
                onClearServerError={onClearServerError}
            >
                <FormField id="email" label="email" type="email" />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Getting code...' : 'Get code'}
                </Button>
            </ValidatedForm>
            {footer}
        </>
    );
}
