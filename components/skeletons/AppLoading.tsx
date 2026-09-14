import { Spinner } from '../ui/spinner';

export default function AppLoading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Spinner />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}
