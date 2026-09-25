'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

import { Playlist } from '@/types';
import SortableVideoCard from './SortableVideoCard';
import ToolTipButton from '../common/ToolTipButton';
import { Check } from 'lucide-react';
import { Button } from '../ui/button';
import { usePlaylist } from '@/hooks/usePlaylist';

export default function SortableVideoGrid({
    playlist,
    handleSave,
}: {
    playlist: Playlist;
    handleSave: () => void;
}) {
    const { updatePositionsMutation } = usePlaylist(playlist.id);

    const [videos, setVideos] = useState(playlist.videos);
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || active.id === over.id) return;

        setVideos((current) => {
            const oldIndex = current.findIndex((video) => video.id === active.id);

            const newIndex = current.findIndex((video) => video.id === over.id);

            const reordered = arrayMove(current, oldIndex, newIndex);

            return reordered.map((video, index) => ({
                ...video,
                position: index,
            }));
        });
    };

    const handleUpdatePositions = () => {
        updatePositionsMutation.mutate(
            {
                playlistId: playlist.id,
                positions: videos.map(({ id, position }) => ({
                    id,
                    position,
                })),
            },
            {
                onSuccess: () => {
                    handleSave();
                },
            },
        );
    };

    return (
        <section>
            <div className="mt-[-5px] mb-3 flex w-full justify-between gap-y-3">
                <h2 className="text-lg font-semibold">Re-order videos</h2>
                <ToolTipButton
                    button={<Button type="button" onClick={handleUpdatePositions} size="icon" />}
                    content="Save order"
                    icon={<Check />}
                />
            </div>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={videos.map((video) => video.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid w-fit w-full grid-cols-[repeat(auto-fill,220px)] justify-center gap-6">
                        {videos.map((video) => (
                            <SortableVideoCard
                                key={video.id}
                                video={video}
                                playlistId={playlist.id}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </section>
    );
}
