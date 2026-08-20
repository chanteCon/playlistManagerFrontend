import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';

export function PasswordInput({ id }: { id: string }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FormField
            id={id}
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required={true}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword((v) => !v)}
            >
                {showPassword ? <EyeOff /> : <Eye />}
            </Button>
        </FormField>
    );
}
