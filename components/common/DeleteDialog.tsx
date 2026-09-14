import { ConfirmationDialog } from './ConfirmationDialog';

type DeleteDialogProps = {
    itemId: string | null;
    onCancel: () => void;
    onConfirm: (itemId: string) => void;
    title: string;
    message: string;
    isPending?: boolean;
};

export function DeleteDialog({
    itemId,
    onCancel,
    onConfirm,
    title,
    message,
    isPending,
}: DeleteDialogProps) {
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
            isPending={isPending}
        />
    );
}
