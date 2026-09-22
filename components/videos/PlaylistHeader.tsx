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
export default function PlaylistHeader({ playlist }: { playlist: Playlist | undefined }) {
    const serverErrorState = useServerErrors();
    const [madeChange, setMadeChange] = useState(false);
    const { editPlaylistMutation } = usePlaylists();
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

    return (
        <>
            <section className="border-b pb-8 flex justify-between">
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
                        inputClassName="border-0 p-1 text-3xl font-bold focus-visible:ring-1 dark:bg-transparent"
                    />

                    <FormTextArea
                        id="description"
                        label="description"
                        hideLabel
                        value={description || ''}
                        className="mt-3 max-w-2xl"
                        onChange={(data) => {
                            setDescription(data);
                            setMadeChange(true);
                        }}
                        textareaClassName="rounded-sm min-h-6 h-auto resize-none overflow-hidden field-sizing-content border-0 bg-transparent p-1 text-base text-muted-foreground shadow-none focus-visible:border-1 focus-visible:ring-0 dark:bg-transparent"
                    />

                    {madeChange && (
                        <Button type="submit" disabled={editPlaylistMutation.isPending}>
                            {editPlaylistMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
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
            </section>
        </>
    );
}
