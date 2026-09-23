import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export default function SearchBar({ className }: { className?: string }) {
    return (
        <div className={cn('relative', className)}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input className="truncate pl-9" placeholder="Search playlists and videos..." />
        </div>
    );
}
