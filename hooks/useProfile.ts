import { useAuth } from '@/contexts/AuthContext';
import { getUser } from '@/requests/protectedRequests';
import { User } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProfile() {
    const { accessToken, isAuthPending } = useAuth();
    const { data } = useQuery({
        queryFn: async () => {
            try {
                return await getUser();
            } catch (error) {
                throw error;
            }
        },
        queryKey: ['profile'],
        enabled: !!accessToken && !isAuthPending,
    });

    return { user: data?.data?.user as User | undefined };
}
