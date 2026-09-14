import AddCard from '../common/AddCard';

export default function CreatePlaylistSection({ onOpen }: { onOpen: () => void }) {
    return (
        <section className="mb-10">
            <h2 className="mb-4 text-lg font-semibold">Create a playlist</h2>
            <AddCard setDialogOpen={onOpen} message={'New Playlist'} />
        </section>
    );
}
