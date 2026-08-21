import { Label } from '@/components/ui/label';
import { useFormContext } from './ValidatedForm';
import { Input } from '@/components/ui/input';
type FormFieldProps = {
    id: string;
    label: string;
    children?: React.ReactNode;
    required?: boolean;
    type?: string;
    error?: string;
    onChange?: (value: string) => void;
    value?: string;
};

export function FormField({
    id,
    label,
    type = 'text',
    children,
    required = false,
    error: customError,
    onChange,
    value,
}: FormFieldProps) {
    const { errors, clearError } = useFormContext();

    const error = customError ?? errors[id];

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="relative">
                <Input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    aria-invalid={!!error}
                    onChange={(event) => {
                        clearError(id);
                        onChange?.(event.target.value);
                    }}
                    required={required}
                    className={children ? 'pr-10' : undefined}
                />

                {children}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
