import { createContext, useContext } from 'react';

type FormContextValue = {
    errors: Record<string, string>;
    clearError: (field: string) => void;
    requiredFields: Set<string>;
};

export const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
    const context = useContext(FormContext);

    if (!context) {
        throw new Error('useFormContext must be used inside ValidatedForm');
    }

    return context;
}
