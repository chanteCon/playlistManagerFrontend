import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';

type AppDropDownProps = {
    children: React.ReactNode;
};

export function AppDropDown({ children }: AppDropDownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <button
                        type="button"
                        aria-label="More options"
                        onClick={(event) => event.stopPropagation()}
                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted cursor-pointer"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </button>
                }
            />

            <DropdownMenuContent>{children}</DropdownMenuContent>
        </DropdownMenu>
    );
}
