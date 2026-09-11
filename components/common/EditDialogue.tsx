import { Button } from '@/components/ui/button';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { EditInput, ServerErrorState } from '@/types';
import { editSchema } from '@/schemas/common';

type EditDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;

    description: string;

    onSubmit: (data: EditInput) => void;

    submitLabel: string;
    serverErrorState?: ServerErrorState;
};

export function EditDialog({
    isOpen,
    onOpenChange,
    title,
    description,
    onSubmit,
    submitLabel,
    serverErrorState,
}: EditDialogProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title="Edit">
            <ValidatedForm
                schema={editSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set([])}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
            >
                <FormField type="text" label="title" id="title" defaultValue={title} />

                <FormField
                    type="text"
                    label="description"
                    id="description"
                    defaultValue={description}
                />

                <Button type="submit" className="w-full">
                    {submitLabel}
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
