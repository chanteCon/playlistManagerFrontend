import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './queryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/components/common/Navbar';
import { ThemeProvider } from '@/components/common/ThemeProvider';

const inter = Inter({
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Playlist Manager',
    description: 'Manage your playlist collection',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html
            lang="en"
            className={`${inter.className} h-full antialiased`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider>
                    <QueryProvider>
                        <AuthProvider>
                            <Navbar />
                            {children}
                        </AuthProvider>
                    </QueryProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
