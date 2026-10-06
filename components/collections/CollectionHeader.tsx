import EditControls from '@/components/common/EditControls';
import { PlaylistHeaderSkeleton } from '@/components/skeletons/PlaylistHeaderSkeleton';
import { CollectionSummary, ValidatedFormRef } from '@/types';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { editSchema } from '@/schemas/common';
import { useServerErrors } from '@/hooks/useServerErrors';
import { useRef, useState } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { Check, X } from 'lucide-react';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { createCollectionSchema } from '@/schemas/collectionsSchemas';
import { ErrorDialog } from '../common/ErrorDialog';
import { toast } from 'sonner';

type CollectionHeaderProps = {
    collection: CollectionSummary | undefined;
    isLoading: boolean;
    editing: boolean;
    onEdit: () => void;
    onDone: () => void;
    onDelete: () => void;
};

export default function CollectionHeader({
    collection,
    editing,
    onEdit,
    onDone,
    onDelete,
}: CollectionHeaderProps) {
    const { editCollectionMutation } = useCollections();
    const serverErrorState = useServerErrors();
    const validatedFormRef = useRef<ValidatedFormRef>(null);
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });
    const [name, setName] = useState(collection?.name);
    const [madeChange, setMadeChange] = useState(false);

    const handleCancel = () => {
        setName(collection?.name);
        setMadeChange(false);
        validatedFormRef.current?.clearErrors();
    };
    const handleEdit = (data: { name: string }) => {
        editCollectionMutation.mutate(
            {
                collectionId: collection!.id,
                ...data,
            },
            {
                onSuccess: () => {
                    onDone();
                    setMadeChange(false);
                    serverErrorState?.setErrors({});
                    toast('Collection updated');
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 409])) {
                        serverErrorState?.setErrors(error.fieldErrors);
                        return;
                    }
                    if (hasErrorStatus(error, 404)) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Collection not found',
                            message: 'This collection no longer exists.',
                        });
                        return;
                    }

                    throw error;
                },
            },
        );
    };

    return (
        <section className="relative flex h-20 items-start justify-between gap-6">
            <div className="min-w-0 flex-1 md:pr-24">
                <ValidatedForm
                    schema={createCollectionSchema}
                    onValidSubmit={handleEdit}
                    requiredFields={new Set([])}
                    serverErrors={serverErrorState?.errors}
                    onClearServerError={serverErrorState?.clearError}
                    key={collection?.id}
                    ref={validatedFormRef}
                >
                    <FormField
                        type="text"
                        label="name"
                        id="name"
                        hideLabel
                        value={name}
                        onChange={(data) => {
                            setName(data);
                            setMadeChange(true);
                        }}
                        inputClassName="w-full border-0 p-1 text-3xl! font-bold focus-visible:ring-1 dark:bg-transparent disabled:!bg-transparent disabled:!opacity-100 disabled:!cursor-default enabled:border"
                        placeHolder={'No name'}
                        disabled={!editing}
                    />

                    {madeChange && (
                        <div className="mt-3 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={editCollectionMutation.isPending}
                            >
                                <X />
                                Cancel
                            </Button>

                            <Button type="submit" disabled={editCollectionMutation.isPending}>
                                <Check />
                                {editCollectionMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    )}
                </ValidatedForm>
            </div>
            <EditControls
                editing={editing}
                onEdit={onEdit}
                onDone={() => {
                    onDone();
                    serverErrorState?.setErrors({});
                    setName(collection?.name);
                    setMadeChange(false);
                }}
                onDelete={onDelete}
                editContent="Edit collection"
                doneContent="Close edit collection"
                deleteContent="Delete collection"
                editClassName="absolute left-0 bottom-0 sm:left-auto sm:right-0 sm:top-0"
                deleteClassName="absolute right-0 bottom-0 sm:bottom-0 sm:right-0 text-destructive"
            />
            <ErrorDialog
                isOpen={errorDialog.isOpen}
                onOpenChange={() =>
                    setErrorDialog((current) => ({
                        ...current,
                        isOpen: false,
                    }))
                }
                message={errorDialog.message}
                title={errorDialog.title}
            />
        </section>
    );
}
