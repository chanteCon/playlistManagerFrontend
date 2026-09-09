import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

type AddCardProps = {
    setDialogOpen: (arg0: boolean) => void;
    message: string;
    className?: string;
};

export default function AddCard({ setDialogOpen, message, className }: AddCardProps) {
    return (
        <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className={cn(
                'group flex h-[120px] w-[180px] cursor-pointer flex-col items-center justify-center border border-dashed bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground',
                className,
            )}
        >
            <Plus className="mb-2 h-7 w-7 transition-transform group-hover:scale-110" />

            <span className="text-sm font-medium">{message}</span>
        </button>
    );
}
