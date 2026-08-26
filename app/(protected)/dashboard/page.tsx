'use client';

import { useQuery } from '@tanstack/react-query';
import { getPlaylists } from '@/requests/protectedRequests';

import type { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
    const { isAuthPending } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryKey: ['playlists'],
        queryFn: getPlaylists,
        enabled: isAuthPending === false,
        retry: false,
    });

    const playlists = data?.data.playlists ?? [];

    if (isAuthPending) {
        return <p>Checking authentication...</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Something went wrong.</p>;
    }

    return (
        <div>
            {playlists.length > 0 ? (
                <>
                    <h1>Playlists:</h1>

                    {playlists.map((playlist) => (
                        <p key={playlist.id}>{playlist.name}</p>
                    ))}
                </>
            ) : (
                <>No playlists added</>
            )}
        </div>
    );
}
