import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { schemas } from '@/api/zod';
import { ServerErrorState } from '@/types';

type CreatePlaylistDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; description?: string }) => void;
    serverErrorState?: ServerErrorState;
};

const createPlaylistSchema = schemas.postApiplaylists_Body;

export function CreatePlaylistDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    serverErrorState,
}: CreatePlaylistDialogProps) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title="Add playlist">
            <ValidatedForm
                schema={createPlaylistSchema}
                onValidSubmit={(data) => {
                    onSubmit(data);
                }}
                requiredFields={new Set(['name', 'description'])}
                formRef={formRef}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
            >
                <FormField type="text" label="name" id="name" />
                <FormField type="text" label="description" id="description" />

                <Button type="submit" className="w-full">
                    Add playlist
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
