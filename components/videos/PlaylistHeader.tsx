import { EditInput, Playlist, ValidatedFormRef } from '@/types';
import { ValidatedForm } from '../forms/ValidatedForm';
import { editSchema } from '@/schemas/common';
import { useServerErrors } from '@/hooks/useServerErrors';
import { FormField } from '../forms/FormField';
import { FormTextArea } from '../forms/FormTextArea';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { usePlaylists } from '@/hooks/usePlaylists';
import {
    buildPlaylistUpdates,
    hasErrorStatus,
    isHandledError,
    mapPlaylistFieldErrors,
} from '@/lib/utils';
import { ErrorDialog } from '../common/ErrorDialog';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useRouter } from 'next/navigation';
import EditControls from '../common/EditControls';

export default function PlaylistHeader({
    playlist,
    onEdit,
    allowEdit,
}: {
    playlist: Playlist | undefined;
    onEdit: (arg0: boolean) => void;
    allowEdit: boolean;
}) {
    const router = useRouter();
    const serverErrorState = useServerErrors();
    const validatedFormRef = useRef<ValidatedFormRef>(null);

    const [madeChange, setMadeChange] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });

    const [name, setName] = useState(playlist?.name);
    const [description, setDescription] = useState(playlist?.description);
    const [editing, setEditing] = useState(false);

    const { editPlaylistMutation, deletePlaylistMutation } = usePlaylists();

    const handleEdit = (data: EditInput) => {
        if (!playlist) {
            return;
        }

        const updates = buildPlaylistUpdates(data);

        editPlaylistMutation.mutate(
            {
                playlistId: playlist.id,
                ...updates,
            },
            {
                onSuccess: () => {
                    toast.success('Playlist updated');
                    setMadeChange(false);
                },
                onError: (error) => {
                    if (isHandledError(error, [400, 409])) {
                        serverErrorState?.setErrors(mapPlaylistFieldErrors(error.fieldErrors));
                    }

                    if (hasErrorStatus(error, 404)) {
                        setErrorDialog({
                            isOpen: true,
                            title: 'Playlist not found',
                            message: 'This playlist no longer exists.',
                        });
                    }
                },
            },
        );
    };

    const handleDelete = () => {
        deletePlaylistMutation.mutate(playlist!.id, {
            onSuccess: () => {
                setDeleting(false);
                router.push('/dashboard');
            },
        });
    };

    const handleCancel = () => {
        setName(playlist?.name);
        setDescription(playlist?.description);
        setMadeChange(false);
        validatedFormRef.current?.clearErrors();
    };

    const handleDoneEditing = () => {
        handleCancel();
        setEditing(false);
        onEdit(false);
    };

    return (
        <section className="relative flex flex-col gap-6 border-b pb-8 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-2 md:w-50">
                <div className="relative h-48 w-full overflow-hidden rounded-md bg-muted md:h-50 md:w-50">
                    {playlist?.coverUrl ? (
                        <img
                            src={playlist.coverUrl}
                            alt={`${playlist.name} cover`}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            No cover
                        </div>
                    )}

                    <div className="md:hidden">
                        {allowEdit && (
                            <EditControls
                                editing={editing}
                                onEdit={() => {
                                    setEditing(true);
                                    onEdit(true);
                                }}
                                onDone={handleDoneEditing}
                                onDelete={() => setDeleting(true)}
                                editContent="Edit playlist"
                                doneContent="Close edit playlist"
                                deleteContent="Delete playlist"
                                editClassName="absolute right-5 top-5 border-2 !border-white !bg-black/70 text-white hover:bg-black/90"

                                deleteClassName="absolute bottom-5 right-5 border-2 !border-white"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="min-w-0 flex-1 md:pr-24">
                <ValidatedForm
                    schema={editSchema}
                    onValidSubmit={handleEdit}
                    requiredFields={new Set([])}
                    serverErrors={serverErrorState?.errors}
                    onClearServerError={serverErrorState?.clearError}
                    key={playlist?.id}
                    ref={validatedFormRef}
                >
                    <FormField
                        type="text"
                        label="title"
                        id="title"
                        hideLabel
                        value={name}
                        onChange={(data) => {
                            setName(data);
                            setMadeChange(true);
                        }}
                        inputClassName="w-full border-0 p-1 text-3xl! font-bold focus-visible:ring-1 dark:bg-transparent disabled:!bg-transparent disabled:!opacity-100 disabled:!cursor-default enabled:border"
                        placeHolder="No name"
                        disabled={!editing}
                    />

                    <FormTextArea
                        id="description"
                        label="description"
                        hideLabel
                        value={description || ''}
                        onChange={(data) => {
                            setDescription(data);
                            setMadeChange(true);
                        }}
                        placeHolder="No description"
                        disabled={!editing}
                        textareaClassName="min-h-6 h-auto w-full resize-none overflow-hidden field-sizing-content border-0 bg-transparent p-1 text-base text-muted-foreground shadow-none focus-visible:border-1 focus-visible:ring-0 dark:bg-transparent disabled:!bg-transparent disabled:!opacity-100 disabled:!cursor-default enabled:border"
                    />

                    {madeChange && (
                        <div className="mt-3 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={editPlaylistMutation.isPending}
                            >
                                <X />
                                Cancel
                            </Button>

                            <Button type="submit" disabled={editPlaylistMutation.isPending}>
                                <Check />
                                {editPlaylistMutation.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    )}
                </ValidatedForm>
            </div>

            <div className="hidden md:block">
                {allowEdit && (
                    <EditControls
                        editing={editing}
                        onEdit={() => {
                            setEditing(true);
                            onEdit(true);
                        }}
                        onDone={handleDoneEditing}
                        onDelete={() => setDeleting(true)}
                        editContent="Edit playlist"
                        doneContent="Close edit playlist"
                        deleteContent="Delete playlist"
                        editClassName="absolute right-0 top-0"
                        deleteClassName="absolute bottom-10 right-0 text-destructive"
                    />
                )}
            </div>
            {editing && (
                <p className="absolute -bottom-6 left-0 text-sm text-muted-foreground">
                    Select a video below to set its thumbnail as the playlist cover.
                </p>
            )}

            <ErrorDialog
                title={errorDialog.title}
                message={errorDialog.message}
                isOpen={errorDialog.isOpen}
                onOpenChange={(isOpen) =>
                    setErrorDialog((current) => ({
                        ...current,
                        isOpen,
                    }))
                }
            />

            <ConfirmationDialog
                title="Delete playlist?"
                message="Are you sure you want to delete this playlist?"
                isOpen={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleting(false);
                    }
                }}
                onCancel={() => setDeleting(false)}
                isPending={deletePlaylistMutation.isPending}
                confirmButton={
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deletePlaylistMutation.isPending}
                    >
                        {deletePlaylistMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                }
            />
        </section>
    );
}
