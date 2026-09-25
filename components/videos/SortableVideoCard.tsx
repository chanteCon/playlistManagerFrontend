'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Video } from '@/types';
import VideoCard from './VideoCard';

export default function SortableVideoCard({
    video,
    playlistId,
}: {
    video: Video;
    playlistId: string;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: video.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <VideoCard video={video} playlistId={playlistId} interactive={false} />
        </div>
    );
}
