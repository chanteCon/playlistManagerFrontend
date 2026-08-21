import { useState } from 'react';

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
            <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
            >
                <span className="relative flex size-5 items-center justify-center">
                    <Eye className={`absolute size-4 ${showPassword ? 'hidden' : 'block'}`} />
                    <EyeOff className={`absolute size-4 ${showPassword ? 'block' : 'hidden'}`} />
                </span>
            </button>
        </FormField>
    );
}
