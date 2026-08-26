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
};

export function EmailCodeForm<T extends z.ZodType>({
    schema,
    onSubmit,
    footer,
}: EmailCodeFormProps<T>) {
    return (
        <>
            <ValidatedForm schema={schema} onValidSubmit={onSubmit} requiredFields={requiredFields}>
                <FormField id="email" label="Email" type="email" />
                <Button type="submit" className="w-full">
                    Get code
                </Button>
            </ValidatedForm>
            <p className="text-sm text-muted-foreground">{footer}</p>
        </>
    );
}
