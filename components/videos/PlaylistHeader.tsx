import { EditInput, Playlist } from '@/types';
import { ValidatedForm } from '../forms/ValidatedForm';
import { editSchema } from '@/schemas/common';
import { useServerErrors } from '@/hooks/useServerErrors';
import { FormField } from '../forms/FormField';
import { FormTextArea } from '../forms/FormTextArea';
import { useState } from 'react';
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
import { Trash } from 'lucide-react';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useRouter } from 'next/navigation';
export default function PlaylistHeader({ playlist }: { playlist: Playlist | undefined }) {
    const router = useRouter();
    const serverErrorState = useServerErrors();
    const [madeChange, setMadeChange] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { editPlaylistMutation, deletePlaylistMutation } = usePlaylists();
    const [errorDialog, setErrorDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
    });
    const [name, setName] = useState(playlist?.name);
    const [description, setDescription] = useState(playlist?.description);
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
        serverErrorState?.setErrors({});
    };

    return (
        <section className="relative border-b pb-8 flex justify-between">
            <ValidatedForm
                schema={editSchema}
                onValidSubmit={handleEdit}
                requiredFields={new Set([])}
                serverErrors={serverErrorState?.errors}
                onClearServerError={serverErrorState?.clearError}
                key={playlist?.id}
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
                    inputClassName="border-0 p-1 text-3xl! font-bold focus-visible:ring-1 dark:bg-transparent"
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
                    textareaClassName="min-w-[400px] rounded-sm min-h-6 h-auto resize-none overflow-hidden field-sizing-content border-0 bg-transparent p-1 text-base text-muted-foreground shadow-none focus-visible:border-1 focus-visible:ring-0 dark:bg-transparent"
                />

                {madeChange && (
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={editPlaylistMutation.isPending}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={editPlaylistMutation.isPending}>
                            {editPlaylistMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                )}
            </ValidatedForm>

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
            <button
                className="absolute right-0 top-0 rounded-lg p-2 hover:bg-muted"
                onClick={() => setDeleting(true)}
            >
                <Trash className="cursor-pointer hover:text-destructive" />
            </button>
            <ConfirmationDialog
                title={'Delete playlist?'}
                message={'Are you sure you want to delete this playlist?'}
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
            ></ConfirmationDialog>
        </section>
    );
}
