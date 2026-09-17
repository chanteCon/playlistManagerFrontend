import { Button } from '../ui/button';
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
            isPending={isPending}
            confirmButton={
                <Button
                    type="button"
                    variant="destructive"
                    className={'light:font-black'}
                    onClick={() => {
                        if (!itemId) return;

                        onConfirm(itemId);
                    }}
                    disabled={isPending}
                >
                    {isPending ? 'Deleting...' : 'Delete'}
                </Button>
            }
        ></ConfirmationDialog>
    );
}
