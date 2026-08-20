import { AppBrand } from './components/AppBrand';

export default function Home() {
    console.log('SERVER_URL:', process.env.SERVER_URL);
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="">
                <AppBrand />
            </main>
        </div>
    );
}
