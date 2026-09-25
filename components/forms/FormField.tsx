import { Label } from '@/components/ui/label';
import { useFormContext } from '@/contexts/ValidatedFormContext';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
type FormFieldProps = {
    id: string;
    label: string;
    children?: React.ReactNode;
    required?: boolean;
    type?: string;
    error?: string;
    onChange?: (value: string) => void;
    value?: string;
    defaultValue?: string;
    className?: string;
    hideLabel?: boolean;
    inputClassName?: string;
    placeHolder?: string;
    disabled?: boolean;
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
    defaultValue,
    className,
    hideLabel,
    inputClassName,
    placeHolder,
    disabled,
}: FormFieldProps) {
    const { errors, clearError } = useFormContext();

    const error = customError ?? errors[id];

    return (
        <div className={cn('space-y-2', className)}>
            {!hideLabel && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <Input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    aria-invalid={!!error}
                    onChange={(event) => {
                        clearError(id);
                        onChange?.(event.target.value);
                    }}
                    required={required}
                    className={cn(children && 'pr-10', inputClassName)}
                    placeholder={placeHolder}
                    disabled={disabled}
                />

                {children}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
