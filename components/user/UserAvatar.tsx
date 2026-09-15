import { cn } from '@/lib/utils';
import { User } from '@/types';

export default function UserAvatar({
    user,
    className,
}: {
    user: User | undefined;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'font-bold bg-primary rounded-full w-10 h-10 flex items-center justify-center border-none text-white',
                className,
            )}
        >
            {user?.username?.[0]?.toUpperCase() ?? '.'}
        </div>
    );
}
