import { addVideoSchema } from '@/schemas/videoSchemas';
import AppDialogue from './AppDialogue';
import { FormField } from './forms/FormField';
import { ValidatedForm } from './forms/ValidatedForm';
import z from 'zod';

type AddVideoProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: z.infer<typeof addVideoSchema>) => void | Promise<void>;
    children: React.ReactNode;
};
export default function AddVideoDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    children,
}: AddVideoProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title={'Add video'}>
            <ValidatedForm
                schema={addVideoSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set(['url'])}
            >
                <FormField id="url" label="URL"></FormField>
                <p className="text-muted-foreground">
                    <strong>Note:</strong> YouTube link previews are supported. YouTube share URLs
                    work best. Videos may not play in the app due to external platform restrictions.
                </p>

                {children}
            </ValidatedForm>
        </AppDialogue>
    );
}
