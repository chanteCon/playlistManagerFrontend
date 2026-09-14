import { useState } from 'react';

export function useServerErrors() {
    const [errors, setErrors] = useState<Record<string, string>>({});

    function clearError(field: string) {
        setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    return {
        errors,
        setErrors,
        clearError,
    };
}
