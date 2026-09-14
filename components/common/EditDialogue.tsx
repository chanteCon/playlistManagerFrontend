import { Button } from '@/components/ui/button';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { EditInput, ServerErrorState } from '@/types';
import { editSchema } from '@/schemas/common';

type EditDialogProps = {
    message?: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;

    description: string;

    onSubmit: (data: EditInput) => void;

    serverErrorState?: ServerErrorState;
    isPending?: boolean;
};

export function EditDialog({
    isOpen,
    onOpenChange,
    title,
    description,
    onSubmit,
    serverErrorState,
    message,
    isPending,
}: EditDialogProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title={message ? message : 'Edit'}>
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
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
