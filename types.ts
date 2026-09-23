import type { paths } from '@/api/schema';
import { editSchema } from './schemas/common';
import { z } from 'zod';

export type ApiResponse<T> = {
    data?: T;
    error?: {
        message: string;
        status?: number;
    };
};

export type Playlists =
    paths['/api/playlists/']['get']['responses'][200]['content']['application/json']['data']['playlists'];

export type PlaylistSummary = Playlists[number];

export type Videos =
    paths['/api/playlists/{id}']['get']['responses']['200']['content']['application/json']['data']['playlist']['videos'];
export type Video = Videos[number];

export type EditInput = z.infer<typeof editSchema>;

export type ServerErrorState = {
    errors: Record<string, string>;
    clearError: (field: string) => void;
};

export type GetPlaylistResponse =
    paths['/api/playlists/{id}']['get']['responses'][200]['content']['application/json'];

export type Playlist =
    paths['/api/playlists/{id}']['get']['responses'][200]['content']['application/json']['data']['playlist'];

type GeneratedUser =
    paths['/api/users/me']['get']['responses']['200']['content']['application/json']['data']['user'];

export type User = Omit<GeneratedUser, 'username'> & {
    username: string;
};

export type GetError = paths['/api/playlists/{id}']['patch']['responses'][404];

export type ValidatedFormRef = {
    clearErrors: () => void;
};
