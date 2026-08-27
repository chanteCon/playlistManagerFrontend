import type { paths } from '@/api/schema';

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
