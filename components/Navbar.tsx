'use client';

import { useAuth } from '@/contexts/AuthContext';
import { AppBrand } from './AppBrand';
import { useMutation } from '@tanstack/react-query';
import { logout } from '@/requests/protectedRequests';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function Navbar() {
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
        <nav className="flex h-16 items-center justify-between border-b px-6">
            <AppBrand variant="navbar" />

            {accessToken && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-muted hover:text-destructive"
                    disabled={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate(accessToken)}
                >
                    Logout
                </Button>
            )}
        </nav>
    );
}
