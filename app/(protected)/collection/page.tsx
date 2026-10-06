'use client';
import { useState } from 'react';
import { CollectionSummary } from '@/types';
import { CreateCollectionDialog } from '@/components/collections/CreateCollctionDialog';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { ErrorDialog } from '@/components/common/ErrorDialog';
import { useCollections } from '@/hooks/useCollections';
import { useServerErrors } from '@/hooks/useServerErrors';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { uuidSchema } from '@/schemas/common';
import { PlaylistGridSkeleton } from '@/components/skeletons/PlaylistGridSkeleton';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { createCollectionSchema } from '@/schemas/collectionsSchemas';
import AppDialogue from '@/components/common/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function CollectionSection({
    isLoading,
    collections,
    onEdit,
    onDelete,
    onCreate,
}: {
    isLoading: boolean;
    collections: CollectionSummary[];
    onEdit: (collection: CollectionSummary) => void;
    onDelete: (collectionId: string) => void;
    onCreate: () => void;
}) {
    if (isLoading) {
        return <PlaylistGridSkeleton />;
    }

    return (
        <Card className="min-h-0 flex-1 p-6 w-full">
            <CollectionGrid
                collections={collections}
                onEdit={onEdit}
                onDelete={onDelete}
                onCreate={onCreate}
            />
        </Card>
    );
}
export default function Dashboard() {
    const {
        collections,
        isLoading,
        error,
        createCollectionMutation,
        deleteCollectionMutation,
        editCollectionMutation,
    } = useCollections();
    const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
    const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
    const [collectionToEdit, setCollectionToEdit] = useState<CollectionSummary | null>(null);
    const [errorDialog, setErrorDialog] = useState({ isOpen: false, title: '', message: '' });
    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerErrors,
    } = useServerErrors();

    const handleEditCollection = (data: { name: string }) => {
        if (!collectionToEdit) return;
        if (!uuidSchema.safeParse(collectionToEdit.id).success) {
            setErrorDialog({
                isOpen: true,
                title: 'Invalid collection',
                message: 'Collection id must be a uuid',
            });
            return;
        }
        editCollectionMutation.mutate(
            { collectionId: collectionToEdit.id, name: data.name },
            {
                onSuccess: () => {
                    setCollectionToEdit(null);
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 409])) {
                        setServerErrors(error.fieldErrors);
                    }
                    if (hasErrorStatus(error, 404)) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Collection not found',
                            message: 'This collection no longer exists.',
                        });
                        setCollectionToEdit(null);
                    }
                },
            },
        );
    };
    const handleDeleteCollection = (collectionId: string) => {
        if (!uuidSchema.safeParse(collectionId).success) {
            setErrorDialog({
                isOpen: true,
                title: 'Invalid collection',
                message: 'Unable to delete this collection',
            });
            return;
        }
        deleteCollectionMutation.mutate(collectionId, {
            onSettled: () => {
                setCollectionToDelete(null);
            },
        });
    };
    type CreateCollectionInput = { name: string };
    const handleCreateCollection = (data: CreateCollectionInput) => {
        createCollectionMutation.mutate(data, {
            onSuccess: () => {
                setIsAddCollectionOpen(false);
            },
            onError: (error) => {
                if (isHandledError(error, [400, 409])) {
                    setServerErrors(error.fieldErrors);
                }
            },
        });
    };
    if (error) {
        return <p>Something went wrong.</p>;
    }
    return (
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col px-6 py-8">
            <h2 className="mb-6 text-lg font-semibold">Your collections</h2>

            <CollectionSection
                isLoading={isLoading}
                collections={collections}
                onEdit={(collection) => {
                    setServerErrors({});
                    setCollectionToEdit(collection);
                }}
                onDelete={setCollectionToDelete}
                onCreate={() => {
                    setIsAddCollectionOpen(true);
                    setServerErrors({});
                }}
            />
            <CreateCollectionDialog
                isOpen={isAddCollectionOpen}
                onOpenChange={setIsAddCollectionOpen}
                serverErrorState={{ errors: serverErrors, clearError: clearServerErrors }}
                isPending={createCollectionMutation.isPending}
                onSubmit={handleCreateCollection}
            />
            {collectionToEdit && (
                <AppDialogue
                    isOpen={!!collectionToEdit}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            setCollectionToEdit(null);
                        }
                    }}
                    title={'Edit collection'}
                >
                    <ValidatedForm
                        schema={createCollectionSchema}
                        onValidSubmit={handleEditCollection}
                        requiredFields={new Set(['name'])}
                        serverErrors={serverErrors}
                        onClearServerError={clearServerErrors}
                    >
                        <FormField
                            type="text"
                            label="name"
                            id="name"
                            defaultValue={collectionToEdit.name}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={editCollectionMutation.isPending}
                        >
                            {editCollectionMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </ValidatedForm>
                </AppDialogue>
            )}
            <DeleteDialog
                isPending={deleteCollectionMutation.isPending}
                title="Delete Collection?"
                message="Are you sure you want to delete this collection? This action cannot be undone."
                itemId={collectionToDelete}
                onCancel={() => setCollectionToDelete(null)}
                onConfirm={handleDeleteCollection}
            />
            <ErrorDialog
                title={errorDialog.title}
                message={errorDialog.message}
                isOpen={errorDialog.isOpen}
                onOpenChange={(isOpen) => setErrorDialog((current) => ({ ...current, isOpen }))}
            />
        </div>
    );
}
