'use client';

import UserAvatar from '@/components/user/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useProfile } from '@/hooks/useProfile';
import { KeyRound, Save } from 'lucide-react';

export default function Settings() {
    const { user } = useProfile();

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account and security settings.
                </p>
            </div>

            <div className="space-y-6">
                <section className="rounded-lg border border-border bg-card">
                    <div className="p-6">
                        <div className="flex items-center gap-4">
                            <UserAvatar user={user} className="h-12 w-12 text-base" />

                            <div>
                                <h2 className="font-semibold text-foreground">Profile</h2>
                                <p className="text-sm text-muted-foreground">
                                    Update your account information.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    defaultValue={user?.username ?? ''}
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    defaultValue={user?.email ?? ''}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end border-t border-border px-6 py-4">
                        <Button>
                            <Save className="h-4 w-4" />
                            Save changes
                        </Button>
                    </div>
                </section>

                <section className="rounded-lg border border-border bg-card">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                <KeyRound className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div>
                                <h2 className="font-semibold text-foreground">Password</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Reset your password if you need to update your login
                                    credentials.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            You will be signed out after resetting your password.
                        </p>

                        <Button variant="outline">Reset password</Button>
                    </div>
                </section>
            </div>
        </main>
    );
}
