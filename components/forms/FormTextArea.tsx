import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from '@/contexts/ValidatedFormContext';
import { cn } from '@/lib/utils';

type FormTextAreaProps = {
    id: string;
    label: string;
    required?: boolean;
    error?: string;
    onChange?: (value: string) => void;
    value?: string;
    defaultValue?: string;
    className?: string;
    hideLabel?: boolean;
    textareaClassName?: string;
    placeHolder?: string;
};

export function FormTextArea({
    id,
    label,
    required = false,
    error: customError,
    onChange,
    value,
    defaultValue,
    className,
    hideLabel,
    textareaClassName,
    placeHolder,
}: FormTextAreaProps) {
    const { errors, clearError } = useFormContext();
    const error = customError ?? errors[id];

    return (
        <div className={cn('space-y-2', className)}>
            {!hideLabel && <Label htmlFor={id}>{label}</Label>}

            <Textarea
                id={id}
                name={id}
                value={value}
                defaultValue={defaultValue}
                aria-invalid={!!error}
                onChange={(event) => {
                    clearError(id);
                    onChange?.(event.target.value);
                }}
                required={required}
                className={textareaClassName}
                placeholder={placeHolder}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
