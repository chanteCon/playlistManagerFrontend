import { Pencil, PencilOff, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EditControlsProps = {
    editing: boolean;
    onEdit: () => void;
    onDone: () => void;
    onDelete?: () => void;

    editContent?: string;
    doneContent?: string;
    deleteContent?: string;

    editClassName?: string;
    deleteClassName?: string;
};

export default function EditControls({
    editing,
    onEdit,
    onDone,
    onDelete,
    editContent = 'Edit',
    doneContent = 'Done editing',
    deleteContent = 'Delete',

    editClassName = '',
    deleteClassName = '',
}: EditControlsProps) {
    if (!editing) {
        return (
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onEdit}
                aria-label={editContent}
                title={editContent}
                className={editClassName}
            >
                <Pencil />
            </Button>
        );
    }

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onDone}
                aria-label={doneContent}
                title={doneContent}
                className={editClassName}
            >
                <PencilOff />
            </Button>

            {onDelete && (
                <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    aria-label={deleteContent}
                    title={deleteContent}
                    className={`flex w-fit gap-2 ${deleteClassName}`}
                >
                    <Trash />
                    <span className="hidden md:block">{deleteContent}</span>
                </Button>
            )}
        </>
    );
}
