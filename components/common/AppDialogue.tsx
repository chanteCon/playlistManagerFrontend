import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type AppDialogueProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children: React.ReactNode;
};

export default function AppDialogue({ isOpen, onOpenChange, title, children }: AppDialogueProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    );
}
