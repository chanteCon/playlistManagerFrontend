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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';
import { AppDropDown } from '@/components/AppDropdown';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';

import {
    Music,
    Gamepad2,
    BookOpen,
    Palette,
    Dumbbell,
    ChefHat,
    Plane,
    Camera,
    GraduationCap,
    Shapes,
} from 'lucide-react';

const playlistIcons = [
    Music,
    Gamepad2,
    BookOpen,
    Palette,
    Dumbbell,
    ChefHat,
    Plane,
    Camera,
    GraduationCap,
    Shapes,
];

type GetPlaylistsResponse =
    paths['/api/playlists/']['get']['responses'][200]['content']['application/json'];
const createPlaylistSchema = schemas.postApiplaylists_Body;

export default function Dashboard() {
    const formRef = useRef<HTMLFormElement>(null);
    const queryClient = useQueryClient();
    const { isAuthPending } = useAuth();
    const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
    const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null);
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
        <div className="mx-auto flex w-full max-w-6xl flex-col px-6 py-10">
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold">Create a playlist</h2>

                <button
                    type="button"
                    onClick={() => setIsAddPlaylistOpen(true)}
                    className="group flex h-[120px] w-[180px] cursor-pointer flex-col items-center justify-center border border-dashed bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
                >
                    <Plus className="mb-2 h-7 w-7 transition-transform group-hover:scale-110" />

                    <span className="text-sm font-medium">New playlist</span>
                </button>
            </section>
            {playlists.length > 0 ? (
                <section className="w-full max-w-[960px]">
                    <h2 className="mb-4 text-lg font-semibold">Your playlists</h2>

                    <div className="mx-auto grid w-fit max-w-full grid-cols-[repeat(auto-fill,220px)] justify-start gap-6">
                        {playlists.map((playlist, index) => {
                            const PlaylistIcon = playlistIcons[index % playlistIcons.length];
                            return (
                                <Card
                                    className="flex group relative h-[220px] w-[220px] overflow-hidden rounded-sm border bg-card transition-shadow hover:shadow-sm"
                                    key={playlist.id}
                                >
                                    <div className="flex flex-1 items-center justify-center border-b">
                                        <PlaylistIcon className="h-20 w-20 text-muted-foreground" />
                                    </div>

                                    <AppDropDown>
                                        <DropdownMenuItem className="cursor-pointer">
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            variant="destructive"
                                            onClick={() => setPlaylistToDelete(playlist.id)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </AppDropDown>

                                    <div className="h-[50px] shrink-0 px-3">
                                        <h2 className="truncate font-semibold">{playlist.name}</h2>

                                        <p className="mt-1 truncate text-sm text-muted-foreground">
                                            {playlist.description || 'No description'}
                                        </p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            ) : (
                <p className="text-muted-foreground">
                    No playlists yet. Create a playlist to start adding videos.
                </p>
            )}

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

            <ConfirmationDialog
                title="Delete playlist?"
                message="Are you sure you want to delete this playlist? This action cannot be undone."
                isOpen={playlistToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPlaylistToDelete(null);
                    }
                }}
                onCancel={() => setPlaylistToDelete(null)}
                onConfirm={() => {
                    if (!playlistToDelete) return;

                    deletePlaylistMutation.mutate(playlistToDelete, {
                        onSuccess: () => {
                            setPlaylistToDelete(null);
                        },
                    });
                }}
            />
        </div>
    );
}
