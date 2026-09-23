'use client';

import { z } from 'zod';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { FormContext } from '@/contexts/ValidatedFormContext';
import { ValidatedFormRef } from '@/types';

type ValidatedFormProps<T extends z.ZodType> = {
    schema: T;
    onValidSubmit: (data: z.infer<T>) => void | Promise<void>;
    children: React.ReactNode;
    requiredFields: Set<string>;
    formRef?: React.RefObject<HTMLFormElement | null>;
    serverErrors?: Record<string, string>;
    onClearServerError?: (field: string) => void;
};

export const ValidatedForm = forwardRef(function ValidatedForm<T extends z.ZodType>(
    {
        schema,
        onValidSubmit,
        children,
        requiredFields,
        serverErrors,
        onClearServerError,
        formRef,
    }: ValidatedFormProps<T>,
    ref: React.ForwardedRef<ValidatedFormRef>,
) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const data = Object.fromEntries(formData.entries());

        const fieldErrors: Record<string, string> = {};

        for (const field of requiredFields) {
            const value = data[field];

            if (value === undefined || value === '') {
                fieldErrors[field] = 'This field is required';
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        const result = schema.safeParse(data);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0];

                if (typeof field === 'string') {
                    fieldErrors[field] = issue.message;
                }
            }

            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        onValidSubmit(result.data);
    }

    function clearError(field: string) {
        setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
        onClearServerError?.(field);
    }

    function clearErrors() {
        setErrors({});

        Object.keys(serverErrors ?? {}).forEach((field) => {
            onClearServerError?.(field);
        });
    }

    useImperativeHandle(ref, () => ({
        clearErrors,
    }));

    return (
        <FormContext.Provider
            value={{
                errors: {
                    ...errors,
                    ...serverErrors,
                },
                clearError,
                requiredFields,
            }}
        >
            <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
                {children}
            </form>
        </FormContext.Provider>
    );
});
