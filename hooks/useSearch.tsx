import { useAuth } from '@/contexts/AuthContext';
import { searchUserLibrary } from '@/requests/protectedRequests';
import { useQuery } from '@tanstack/react-query';

export function useSearch(search: string) {
    const { accessToken, isAuthPending } = useAuth();
    return useQuery({
        queryKey: ['search', search],
        queryFn: () => searchUserLibrary(search),
        enabled: !isAuthPending && !!accessToken && search.trim().length > 0,
        retry: false,
    });
}
