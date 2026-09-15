import { useProfile } from '@/hooks/useProfile';
import { Button } from '../ui/button';
import { AppDropDown } from '../common/AppDropdown';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/requests/protectedRequests';
import { Skeleton } from '../ui/skeleton';

export default function UseAvatar() {
    const { user } = useProfile();
    const { accessToken, clearAccessToken } = useAuth();
    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSettled: () => {
            clearAccessToken();
            router.push('/');
        },
    });
    return (
        accessToken && (
            <AppDropDown
                contentStyling="w-[min(15rem,70vw)]"
                trigger={
                    <Button className="font-bold flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
                        <span className="leading-none">
                            {user?.username?.[0]?.toUpperCase() ?? '.'}
                        </span>
                    </Button>
                }
            >
                <div className="flex flex-col items-center mx-1 mb-1 rounded-md border border-border bg-muted/50 px-3 py-3.5">
                    <div className="font-bold bg-primary rounded-full w-10 h-10 flex items-center justify-center border-none text-white">
                        {user?.username?.[0]?.toUpperCase() ?? '.'}
                    </div>
                    <p className="text-sm font-medium text-foreground">{user?.username}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
                </div>

                <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Manage profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                    disabled={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate(accessToken)}
                >
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </AppDropDown>
        )
    );
}
