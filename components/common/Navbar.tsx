'use client';

import { AppBrand } from './AppBrand';
import UserAvatar from '../user/UserAvatar';

export default function Navbar() {
    return (
        <nav className="flex h-16 items-center justify-between border-b px-6">
            <AppBrand variant="navbar" />

            <UserAvatar />
        </nav>
    );
}
