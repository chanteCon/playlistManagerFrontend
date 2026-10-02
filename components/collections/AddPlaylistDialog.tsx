import { Dispatch, useState } from 'react';
import AppDialogue from '../common/AppDialogue';
import { Input } from '@base-ui/react';
import { Button } from '../ui/button';
type AddPlaylistDialogParams = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    availablePlaylists: { name: string; id: string }[];
    selectedPlaylists: string[];
    setSelectedPlaylists: Dispatch<React.SetStateAction<string[]>>;
    onClick: () => void;
};
export default function AddPlaylistDialog({
    isOpen,
    onOpenChange,
    availablePlaylists,
    selectedPlaylists,
    setSelectedPlaylists,
    onClick,
}: AddPlaylistDialogParams) {
    const [playlistSearch, setPlaylistSearch] = useState('');
    const search = playlistSearch.trim().toLowerCase();

    const filteredPlaylists = availablePlaylists.filter((playlist) =>
        playlist.name.toLowerCase().includes(search),
    );
    return (
        <AppDialogue isOpen={isOpen} onOpenChange={onOpenChange} title="Select playlist to add">
            <div className="space-y-4">
                {availablePlaylists.length > 5 && (
                    <Input
                        placeholder="Search playlists..."
                        value={playlistSearch}
                        onChange={(event) => {
                            setPlaylistSearch(event.target.value);
                        }}
                    />
                )}

                <div className="max-h-80 overflow-y-auto">
                    {filteredPlaylists.length > 0 ? (
                        <div className="space-y-1">
                            {filteredPlaylists.map((playlist) => {
                                const isSelected = selectedPlaylists.includes(playlist.id);
                                return (
                                    <Button
                                        key={playlist.id}
                                        variant={isSelected ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        onClick={() =>
                                            setSelectedPlaylists((current) =>
                                                isSelected
                                                    ? current.filter((p) => p !== playlist.id)
                                                    : [...current, playlist.id],
                                            )
                                        }
                                    >
                                        {playlist.name}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No playlists to add
                        </p>
                    )}
                </div>
                {selectedPlaylists.length > 0 && <Button onClick={onClick}>Add playlists</Button>}
            </div>
        </AppDialogue>
    );
}
