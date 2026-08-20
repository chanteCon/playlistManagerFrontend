import { Label } from '@/components/ui/label';
import { useFormContext } from './ValidatedForm';
import { Input } from '@/components/ui/input';
type FormFieldProps = {
    id: string;
    label: string;
    children?: React.ReactNode;
    required?: boolean;
    type?: string;
};
export function FormField({
    id,
    label,
    type = 'text',
    children,
    required = false,
}: FormFieldProps) {
    const { errors, clearError } = useFormContext();
    const error = errors[id];

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="relative">
                <Input
                    id={id}
                    name={id}
                    type={type}
                    aria-invalid={!!error}
                    onChange={() => clearError(id)}
                    required={required}
                    className={children ? 'pr-10' : undefined}
                />

                {children}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
