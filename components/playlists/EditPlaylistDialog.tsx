import { z } from 'zod';

import { Button } from '@/components/ui/button';
import AppDialogue from '@/components/AppDialogue';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { schemas } from '@/api/zod';
import { Playlist } from '@/types';

const editPlaylistSchema = schemas.patchApiplaylistsId_Body;

type EditPlaylistInput = z.infer<typeof editPlaylistSchema>;

type EditPlaylistDialogProps = {
    playlist: Playlist | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: EditPlaylistInput) => void;
};

export function EditPlaylistDialog({
    playlist,
    isOpen,
    onOpenChange,
    onSubmit,
}: EditPlaylistDialogProps) {
    if (!playlist) return null;

    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title="Edit playlist">
            <ValidatedForm
                key={playlist.id}
                schema={editPlaylistSchema}
                onValidSubmit={onSubmit}
                requiredFields={new Set([])}
            >
                <FormField type="text" label="name" id="name" defaultValue={playlist.name} />

                <FormField
                    type="text"
                    label="description"
                    id="description"
                    defaultValue={playlist.description ?? ''}
                />

                <Button type="submit" className="w-full">
                    Edit playlist
                </Button>
            </ValidatedForm>
        </AppDialogue>
    );
}
