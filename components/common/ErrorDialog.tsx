import AppDialogue from '@/components/common/AppDialogue';
import { Button } from '../ui/button';
type ErrorDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message: string;
};

export function ErrorDialog({ isOpen, onOpenChange, title, message }: ErrorDialogProps) {
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
            <div className="flex flex-col gap-6">
                <p className="text-sm text-muted-foreground">{message}</p>

                <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
                    OK
                </Button>
            </div>
        </AppDialogue>
    );
}
