'use client';
import { useState } from 'react';
import { PasswordInput } from '../forms/PasswordInput';

export function PasswordFields() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password;

    return (
        <>
            <PasswordInput
                id="password"
                label="New password"
                value={password}
                onChange={setPassword}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
                id="confirmPassword"
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword(!showPassword)}
                error={passwordsMismatch ? 'Passwords do not match' : undefined}
            />
        </>
    );
}
