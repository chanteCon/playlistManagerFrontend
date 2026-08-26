import { authenticatedApiRequest } from '@/lib/apiRequest';
import { protectedApi } from '@/api/createClient';

export const getPlaylists = () =>
    authenticatedApiRequest(() => protectedApi.GET('/api/playlists/', {}));

export const logout = (accessToken: string) =>
    protectedApi.POST('/api/auth/logout', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });
