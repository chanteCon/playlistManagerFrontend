import { ConfirmationDialog } from '../ConfirmationDialog';

type DeletePlaylistDialogProps = {
    playlistId: string | null;
    onCancel: () => void;
    onConfirm: (playlistId: string) => void;
};

export function DeletePlaylistDialog({
    playlistId,
    onCancel,
    onConfirm,
}: DeletePlaylistDialogProps) {
    return (
        <ConfirmationDialog
            title="Delete playlist?"
            message="Are you sure you want to delete this playlist? This action cannot be undone."
            isOpen={playlistId !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onCancel();
                }
            }}
            onCancel={onCancel}
            onConfirm={() => {
                if (!playlistId) return;

                onConfirm(playlistId);
            }}
        />
    );
}
