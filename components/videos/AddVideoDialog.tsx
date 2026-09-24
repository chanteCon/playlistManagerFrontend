import { addVideoSchema } from '@/schemas/videoSchemas';
import AppDialogue from '../common/AppDialogue';
import { FormField } from '../forms/FormField';
import { ValidatedForm } from '../forms/ValidatedForm';
import z from 'zod';
import { ServerErrorState } from '@/types';

type AddVideoProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof addVideoSchema>) => void | Promise<void>;
    children: React.ReactNode;
    serverErrorState?: ServerErrorState;
};
export default function AddVideoDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    children,
    serverErrorState,
}: AddVideoProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title={'Add video'}>
            <ValidatedForm
                schema={addVideoSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set(['url'])}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
            >
                <FormField id="url" label="URL"></FormField>
                <p className="text-muted-foreground">
                    <strong>Note:</strong> YouTube and TikTok link previews are supported. Playback
                    is attempted for YouTube and TikTok videos, but videos may not play in the app
                    due to external platform restrictions. Other platforms are not supported for
                    previews or playback.
                </p>

                {children}
            </ValidatedForm>
        </AppDialogue>
    );
}
