import { authenticatedApiRequest } from '@/lib/apiRequest';
import { protectedApi } from '@/api/createClient';
import { schemas } from '@/api/zod';
import { z } from 'zod';

type CreatePlaylistInput = z.infer<typeof schemas.postApiplaylists_Body>;

export const getPlaylists = () =>
    authenticatedApiRequest(() => protectedApi.GET('/api/playlists/', {}));

export const logout = (accessToken: string) =>
    protectedApi.POST('/api/auth/logout', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

export const createPlaylist = (data: CreatePlaylistInput) =>
    authenticatedApiRequest(() => protectedApi.POST('/api/playlists/', { body: data }));

export const deletePlaylist = (playlistId: string) =>
    authenticatedApiRequest(() =>
        protectedApi.DELETE('/api/playlists/{id}', {
            params: {
                path: {
                    id: playlistId,
                },
            },
            credentials: 'include',
        }),
    );
