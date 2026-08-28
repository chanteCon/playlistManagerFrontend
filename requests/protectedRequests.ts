import { authenticatedApiRequest } from '@/lib/apiRequest';
import { protectedApi } from '@/api/createClient';
import { schemas } from '@/api/zod';
import { z } from 'zod';
import { addVideoSchema } from '@/schemas/videoSchemas';

type CreatePlaylistInput = z.infer<typeof schemas.postApiplaylists_Body>;
type AddVideoInput = z.infer<typeof addVideoSchema> & { playlistId: string };

export const getPlaylists = () =>
    authenticatedApiRequest(() => protectedApi.GET('/api/playlists/', { credentials: 'include' }));

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

export const editPlaylist = (data: { playlistId: string; name?: string; description?: string }) => {
    const { name, playlistId, description } = data;

    return authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/playlists/{id}', {
            body: {
                name,
                description,
            },
            params: {
                path: {
                    id: playlistId,
                },
            },
            credentials: 'include',
        }),
    );
};

export const getPlaylist = (playlistId: string) =>
    authenticatedApiRequest(() =>
        protectedApi.GET('/api/playlists/{id}', {
            params: {
                path: {
                    id: playlistId,
                },
            },
            credentials: 'include',
        }),
    );

export const addVideoToPlaylist = (data: AddVideoInput) =>
    authenticatedApiRequest(() =>
        protectedApi.POST('/api/playlists/{id}/videos', {
            body: { url: data.url },
            params: {
                path: {
                    id: data.playlistId,
                },
            },
            credentials: 'include',
        }),
    );
