import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { EllipsisVertical } from 'lucide-react';

type AppDropDownProps = {
    children: React.ReactNode;
    className?: string;
    trigger?: React.ReactElement;
    contentStyling?: string;
};

export function AppDropDown({ children, className, trigger, contentStyling }: AppDropDownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    trigger ?? (
                        <button
                            type="button"
                            aria-label="More options"
                            onClick={(event) => event.stopPropagation()}
                            className={cn(
                                'absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 z-10 transition-opacity group-hover:opacity-100 hover:bg-muted cursor-pointer',
                                className,
                            )}
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </button>
                    )
                }
            />

            <DropdownMenuContent className={contentStyling}>{children}</DropdownMenuContent>
        </DropdownMenu>
    );
}
