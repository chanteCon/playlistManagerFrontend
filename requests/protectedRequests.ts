import { authenticatedApiRequest } from '@/lib/apiRequest';
import { protectedApi } from '@/api/createClient';
import { schemas } from '@/api/zod';
import { z } from 'zod';
import { addVideoSchema } from '@/schemas/videoSchemas';

type CreatePlaylistInput = z.infer<typeof schemas.postApiplaylists_Body>;
type AddVideoInput = z.infer<typeof addVideoSchema> & { playlistId: string };
type VideoIdentity = { playlistId: string; videoId: string };

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

export const editPlaylist = async (data: {
    playlistId: string;
    name?: string;
    description?: string;
    cover?: string;
}) => {
    const { name, playlistId, description, cover } = data;
    return authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/playlists/{id}', {
            body: {
                name,
                description,
                cover,
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

export const editPositons = async (data: {
    playlistId: string;
    positions: { id: string; position: number }[];
}) => {
    const { playlistId, positions } = data;
    return authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/playlists/{id}/videos/positions', {
            body: {
                positions,
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

export const deleteVideoFromPlaylist = ({ playlistId, videoId }: VideoIdentity) =>
    authenticatedApiRequest(() =>
        protectedApi.DELETE('/api/playlists/{id}/videos/{playlistVideoId}', {
            params: {
                path: {
                    id: playlistId,
                    playlistVideoId: videoId,
                },
            },
            credentials: 'include',
        }),
    );

export const patchVideo = (data: {
    playlistId: string;
    videoId: string;
    title?: string;
    description?: string;
}) => {
    const { title, playlistId, description } = data;

    return authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/playlists/{id}/videos/{playlistVideoId}', {
            body: {
                title,
                description,
            },
            params: {
                path: {
                    id: playlistId,
                    playlistVideoId: data.videoId,
                },
            },
            credentials: 'include',
        }),
    );
};

export const getUser = () =>
    authenticatedApiRequest(() =>
        protectedApi.GET('/api/users/me', {
            credentials: 'include',
        }),
    );

export const patchUser = (data: { username: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/users/me', {
            body: { username: data.username },
            credentials: 'include',
        }),
    );

export const patchUserEmail = (data: { email: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/users/update-email', {
            body: { email: data.email },
            credentials: 'include',
        }),
    );

export const deleteUser = () =>
    authenticatedApiRequest(() =>
        protectedApi.DELETE('/api/users/me', {
            credentials: 'include',
        }),
    );

export const searchUserLibrary = (search: string) =>
    authenticatedApiRequest(() =>
        protectedApi.GET('/api/search', {
            params: {
                query: {
                    search,
                },
            },
            credentials: 'include',
        }),
    );

export const getCollections = () =>
    authenticatedApiRequest(() =>
        protectedApi.GET('/api/collections/', {
            credentials: 'include',
        }),
    );

export const getCollection = ({ id }: { id: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.GET('/api/collections/{id}', {
            params: { path: { id } },
            credentials: 'include',
        }),
    );

export const createCollection = (data: { name: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.POST('/api/collections/', {
            body: data,
            credentials: 'include',
        }),
    );

export const editCollection = (data: { collectionId: string; name?: string; cover?: string }) => {
    const { collectionId, name, cover } = data;

    return authenticatedApiRequest(() =>
        protectedApi.PATCH('/api/collections/{id}', {
            body: {
                name,
                cover,
            },
            params: {
                path: {
                    id: collectionId,
                },
            },
            credentials: 'include',
        }),
    );
};

export const deleteCollection = (collectionId: string) =>
    authenticatedApiRequest(() =>
        protectedApi.DELETE('/api/collections/{id}', {
            params: {
                path: {
                    id: collectionId,
                },
            },
            credentials: 'include',
        }),
    );

export const addPlaylistToCollection = (data: { collectionId: string; playlistId: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.POST('/api/collections/{id}/playlists/{playlistId}', {
            params: {
                path: {
                    id: data.collectionId,
                    playlistId: data.playlistId,
                },
            },
            credentials: 'include',
        }),
    );

export const deletePlaylistFromCollection = (data: { collectionId: string; playlistId: string }) =>
    authenticatedApiRequest(() =>
        protectedApi.DELETE('/api/collections/{id}/playlists/{playlistId}', {
            params: {
                path: {
                    id: data.collectionId,
                    playlistId: data.playlistId,
                },
            },
            credentials: 'include',
        }),
    );
