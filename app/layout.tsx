import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './queryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';

const inter = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Playlist Manager',
    description: 'Manage your playlist collection',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="en" className={`${inter.className} h-full antialiased`}>
            <body className="min-h-full flex flex-col bg-muted/30">
                <QueryProvider>
                    <AuthProvider>
                        <Navbar />
                        {children}
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
