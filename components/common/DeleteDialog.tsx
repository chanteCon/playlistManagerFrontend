import { ConfirmationDialog } from './ConfirmationDialog';

type DeleteDialogProps = {
    itemId: string | null;
    onCancel: () => void;
    onConfirm: (itemId: string) => void;
    title: string;
    message: string;
};

export function DeleteDialog({ itemId, onCancel, onConfirm, title, message }: DeleteDialogProps) {
    return (
        <ConfirmationDialog
            title={title}
            message={message}
            isOpen={itemId !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onCancel();
                }
            }}
            onCancel={onCancel}
            onConfirm={() => {
                if (!itemId) return;

                onConfirm(itemId);
            }}
        />
    );
}
