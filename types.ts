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

export type Playlist = Playlists[number];

export type Videos =
    paths['/api/playlists/{id}']['get']['responses']['200']['content']['application/json']['data']['playlist']['videos'];
export type Video = Videos[number];

export type EditInput = z.infer<typeof editSchema>;
