'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { createPlaylist, deletePlaylist, getPlaylists } from '@/requests/protectedRequests';

import type { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';
import { schemas } from '@/api/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import AppDialogue from '@/components/AppDialogue';
import { Trash2, X } from 'lucide-react';

type GetPlaylistsResponse =
    paths['/api/playlists/']['get']['responses'][200]['content']['application/json'];
const createPlaylistSchema = schemas.postApiplaylists_Body;

export default function Dashboard() {
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();
    const { isAuthPending } = useAuth();
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const { data, isLoading, error } = useQuery({
        queryKey: ['playlists'],
        queryFn: getPlaylists,
        enabled: isAuthPending === false,
        retry: false,
    });

    const playlists = data?.data.playlists ?? [];

    const createPlaylistMutation = useMutation({
        mutationFn: createPlaylist,
        onError: (error) => alert(error),
        onSuccess: (data) => {
            formRef.current?.reset();
            setIsAddPlaylistOpen(false);
            queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                if (!current || !data) return current;
                return {
                    ...current,
                    data: {
                        ...current.data,
                        playlists: [...current.data.playlists, data.data.playlist],
                    },
                };
            });
        },
    });

    const deletePlaylistMutation = useMutation({
        mutationFn: deletePlaylist,

        onError: (error) => alert(error),

        onSuccess: (_, playlistId) => {
            queryClient.setQueryData<GetPlaylistsResponse>(['playlists'], (current) => {
                if (!current) return current;

                return {
                    ...current,
                    data: {
                        ...current.data,
                        playlists: current.data.playlists.filter(
                            (playlist) => playlist.id !== playlistId,
                        ),
                    },
                };
            });
        },
    });
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
        <div className="flex flex-col items-center space-y-5 w-full max-w-6xl mx-auto px-5">
            <h1 className="text-2xl text-primary">Playlists:</h1>
            <div className="grid grid-cols-[repeat(auto-fit,200px)] justify-center gap-10 w-full">
                <button
                    type="button"
                    onClick={() => setIsAddPlaylistOpen(true)}
                    className="w-[200px] h-[200px] rounded-xl border flex items-center justify-center hover:bg-muted cursor-pointer"
                >
                    <span className="text-5xl text-primary">+</span>
                </button>
                <AppDialogue
                    isOpen={isAddPlaylistOpen}
                    onOpenChange={setIsAddPlaylistOpen}
                    title="Add playlist"
                >
                    <ValidatedForm
                        schema={createPlaylistSchema}
                        onValidSubmit={createPlaylistMutation.mutate}
                        requiredFields={new Set(['name', 'description'])}
                        formRef={formRef}
                    >
                        <FormField type="text" label="name" id="name" />
                        <FormField type="text" label="description" id="description" />

                        <Button type="submit" className="w-full">
                            Add playlist
                        </Button>
                    </ValidatedForm>
                </AppDialogue>
                {playlists.map((playlist) => (
                    <Card
                        className="group relative flex w-[200px] h-[200px] text-center p-5 justify-center overflow-visible"
                        key={playlist.id}
                    >
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                deletePlaylistMutation.mutate(playlist.id);
                            }}
                            aria-label="Delete playlist"
                            className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive cursor-pointer"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <h2 className="text-lg font-bold text-primary truncate">{playlist.name}</h2>
                        <p className="text-muted-foreground truncate">{playlist.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
