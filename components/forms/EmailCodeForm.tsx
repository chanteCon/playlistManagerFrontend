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
};

export function EmailCodeForm<T extends z.ZodType>({
    schema,
    onSubmit,
    footer,
    serverErrors,
    onClearServerError,
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
                <FormField id="email" label="Email" type="email" />
                <Button type="submit" className="w-full">
                    Get code
                </Button>
            </ValidatedForm>
            {footer}
        </>
    );
}
