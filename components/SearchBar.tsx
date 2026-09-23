'use client';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import { useRouter } from 'next/navigation';
export default function SearchBar({ className }: { className?: string }) {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const searchBarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);
    useEffect(() => {
        const handleClickOutside = (event: PointerEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setSearch('');
                setDebouncedSearch('');
            }
        };
        document.addEventListener('pointerdown', handleClickOutside);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, []);
    const { data } = useSearch(debouncedSearch);
    const showResults = search.trim().length > 0 && debouncedSearch.length > 0 && !!data;
    const playlists = data?.data.results.playlists ?? [];
    const videos = data?.data.results.videos ?? [];
    const hasResults = playlists.length > 0 || videos.length > 0;
    const handleResultClick = (path: string) => {
        setSearch('');
        setDebouncedSearch('');
        router.push(path);
    };
    return (
        <div ref={searchBarRef} className={cn('relative', className)}>
            {' '}
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2" />{' '}
            <Input
                className="truncate pl-9"
                placeholder="Search playlists and videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />{' '}
            {showResults && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-md border bg-popover p-1 shadow-md">
                    {' '}
                    {!hasResults ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {' '}
                            No results found{' '}
                        </div>
                    ) : (
                        <>
                            {' '}
                            {playlists.length > 0 && (
                                <div>
                                    {' '}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        {' '}
                                        Playlists{' '}
                                    </div>{' '}
                                    {playlists.map((playlist) => (
                                        <button
                                            key={playlist.id}
                                            type="button"
                                            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                                            onClick={() =>
                                                handleResultClick(`/playlist/${playlist.id}`)
                                            }
                                        >
                                            {' '}
                                            {playlist.name}{' '}
                                        </button>
                                    ))}{' '}
                                </div>
                            )}{' '}
                            {videos.length > 0 && (
                                <div>
                                    {' '}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                        {' '}
                                        Videos{' '}
                                    </div>{' '}
                                    {videos.slice(0, 10).map((video) => (
                                        <button
                                            key={video.id}
                                            type="button"
                                            className="flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                                            onClick={() =>
                                                handleResultClick(
                                                    `/playlist/${video.playlistId}/watch/${video.id}`,
                                                )
                                            }
                                        >
                                            {video.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
