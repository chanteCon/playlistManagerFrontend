'use client';

import { AppBrand } from './AppBrand';
import UserSettingsDropDown from '../user/UserSettingsDropDown';

export default function Navbar() {
    return (
        <nav className="flex h-16 items-center justify-between border-b px-6">
            <AppBrand variant="navbar" />

            <UserSettingsDropDown />
        </nav>
    );
}
