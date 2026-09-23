import { Button } from '@/components/ui/button';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { EditInput, ServerErrorState } from '@/types';
import { editSchema } from '@/schemas/common';
import { FormTextArea } from '../forms/FormTextArea';

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

                <FormTextArea
                    id="description"
                    label="description"
                    hideLabel
                    defaultValue={description || ''}
                    textareaClassName="max-h-[400px] overflow-y-auto"
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
