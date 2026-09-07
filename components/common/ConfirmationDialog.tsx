import AppDialogue from './AppDialogue';
import { Button } from '../ui/button';

type ConfirmationDialogProps = {
    title: string;
    message: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmationDialog({
    title,
    message,
    isOpen,
    onOpenChange,
    onCancel,
    onConfirm,
}: ConfirmationDialogProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{message}</p>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>

                    <Button type="button" variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </div>
            </div>
        </AppDialogue>
    );
}
