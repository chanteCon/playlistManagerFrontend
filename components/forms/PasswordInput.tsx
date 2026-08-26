import { Eye, EyeOff } from 'lucide-react';
import { FormField } from './FormField';

type PasswordInputProps = {
    id: string;
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
    showPassword?: boolean;
    onToggleShowPassword?: () => void;
};
export function PasswordInput({
    id,
    label = 'Password',
    value = '',
    onChange,
    error,
    showPassword = false,
    onToggleShowPassword,
}: PasswordInputProps) {
    return (
        <FormField
            id={id}
            label={label}
            type={showPassword ? 'text' : 'password'}
            required
            value={value}
            onChange={onChange}
            error={error}
        >
            <button
                type="button"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={onToggleShowPassword}
            >
                {id === 'password' && (
                    <span className="relative flex size-5 items-center justify-center">
                        <Eye className={`absolute size-4 ${showPassword ? 'hidden' : 'block'}`} />
                        <EyeOff
                            className={`absolute size-4 ${showPassword ? 'block' : 'hidden'}`}
                        />
                    </span>
                )}
            </button>
        </FormField>
    );
}
