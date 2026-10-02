import { ServerErrorState } from '@/types';
import { useRef } from 'react';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '../forms/ValidatedForm';
import { createCollectionSchema } from '@/schemas/collectionsSchemas';
import { FormField } from '../forms/FormField';
import { Button } from '../ui/button';

type CreateCollectionDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string }) => void;
    serverErrorState?: ServerErrorState;
    isPending?: boolean;
};

export function CreateCollectionDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    serverErrorState,
    isPending,
}: CreateCollectionDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title="Add collection">
            <ValidatedForm
                schema={createCollectionSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set(['name'])}
                formRef={formRef}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
            >
                <FormField type="text" label="name" id="name" />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add collection'}
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
