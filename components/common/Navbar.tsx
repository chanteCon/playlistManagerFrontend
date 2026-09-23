'use client';

import { AppBrand } from './AppBrand';
import UserSettingsDropDown from '../user/UserSettingsDropDown';
import SearchBar from '../SearchBar';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
    const { accessToken, isAuthPending } = useAuth();
    return (
        <nav className="flex h-16 items-center justify-between border-b px-6">
            <AppBrand variant="navbar" />
            {accessToken && !isAuthPending && (
                <SearchBar className="w-48 sm:w-64 md:w-80 lg:w-96" />
            )}
            <UserSettingsDropDown />
        </nav>
    );
}
