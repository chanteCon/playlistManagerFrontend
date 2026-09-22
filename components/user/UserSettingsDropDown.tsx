import { useProfile } from '@/hooks/useProfile';
import { AppDropDown } from '../common/AppDropdown';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserAvatar from './UserAvatar';
import { Switch } from '../ui/switch';
import { useTheme } from 'next-themes';
import { ConfirmationDialog } from '../common/ConfirmationDialog';
import { useState } from 'react';
import { Button } from '../ui/button';

export default function UserSettingsDropDown() {
    const { user, logoutMutation } = useProfile();
    const { accessToken, clearAccessToken } = useAuth();
    const router = useRouter();
    const { setTheme, theme } = useTheme();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleThemeChange = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
    };

    const hanldeLogOut = () => {
        logoutMutation.mutate(accessToken!, {
            onSettled: () => {
                clearAccessToken();
                router.replace('/');
            },
        });
    };

    return (
        accessToken && (
            <>
                <AppDropDown
                    contentStyling="w-[min(15rem,70vw)] flex flex-col gap-y-1"
                    trigger={
                        <button className="">
                            <UserAvatar user={user} className="font-medium h-7 w-7" />
                        </button>
                    }
                >
                    <div className="flex flex-col items-center mx-1 mb-1 rounded-md border border-border bg-muted/50 px-3 py-3.5">
                        <UserAvatar user={user} />
                        <p className="text-sm font-medium text-foreground">{user?.username}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
                    </div>

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => router.push('/settings')}
                    >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span>Manage profile</span>
                    </DropdownMenuItem>
                    <hr />

                    <DropdownMenuItem>
                        <Switch
                            className="text-muted-foreground cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={handleThemeChange}
                            checked={theme === 'dark'}
                        ></Switch>
                        <p>Dark mode</p>
                    </DropdownMenuItem>
                    <hr />

                    <DropdownMenuItem
                        className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                        disabled={logoutMutation.isPending}
                        onClick={() => setLoggingOut(true)}
                    >
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        <span>Logout</span>
                    </DropdownMenuItem>
                </AppDropDown>
                <ConfirmationDialog
                    title={'Logout'}
                    message={'Are you sure you want to logout?'}
                    isOpen={loggingOut}
                    onOpenChange={(open) => {
                        if (!open) {
                            setLoggingOut(false);
                        }
                    }}
                    onCancel={() => setLoggingOut(false)}
                    confirmButton={
                        <Button
                            type="button"
                            onClick={() => {
                                hanldeLogOut();
                            }}
                            disabled={logoutMutation.isPending}
                        >
                            {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
                        </Button>
                    }
                />
            </>
        )
    );
}
