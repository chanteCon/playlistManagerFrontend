'use client';

import UserAvatar from '@/components/user/UserAvatar';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useProfile } from '@/hooks/useProfile';

import { Check, KeyRound, Loader2, Mail, Save } from 'lucide-react';

import { useState } from 'react';

import { ValidatedForm } from '@/components/forms/ValidatedForm';
import { FormField } from '@/components/forms/FormField';

import { userNameSchema } from '@/schemas/common';
import { emailSchema } from '@/schemas/authSchemas';

import { useServerErrors } from '@/hooks/useServerErrors';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { useRouter } from 'next/navigation';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { ErrorDialog } from '@/components/common/ErrorDialog';

const SettingsButton = ({
    isPending,
    saved,
    changed,
}: {
    isPending: boolean;
    saved: boolean;
    changed: boolean;
}) => {
    return (
        <Button type="submit" disabled={!changed}>
            {isPending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                </>
            ) : saved ? (
                <>
                    <Check className="h-4 w-4" />
                    Saved
                </>
            ) : (
                <>
                    <Save className="h-4 w-4" />
                    Save changes
                </>
            )}
        </Button>
    );
};

export default function Settings() {
    const {
        user,
        updateUserMutation,
        updateUserEmailMutation,
        logoutMutation,
        reqPasswordCodeMutation,
        deleteUserMutation,
    } = useProfile();
    const { accessToken } = useAuth();
    const [changedName, setChangedName] = useState(false);
    const [changedEmail, setChangedEmail] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [nameSaved, setNameSaved] = useState(false);
    const [changingEmail, setChangingEmail] = useState(false);
    const [resettingPassword, setResettingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const router = useRouter();

    const {
        errors: serverErrors,
        setErrors: setServerErrors,
        clearError: clearServerErrors,
    } = useServerErrors();

    const handleUpdateUser = (data: { username: string }) => {
        updateUserMutation.mutate(data, {
            onError: (error) => {
                if (isHandledError(error, [400, 409])) {
                    setServerErrors(error.fieldErrors);
                }
            },
            onSuccess: () => {
                setNameSaved(true);
            },
        });
    };

    const handleUpdateEmail = (data: { email: string }) => {
        updateUserEmailMutation.mutate(data, {
            onError: (error) => {
                setChangingEmail(false);

                if (isHandledError(error, [400, 409])) {
                    setServerErrors(error.fieldErrors);
                }
                if (hasErrorStatus(error, 403)) {
                    setErrorMessage(error.message);
                }
            },
            onSuccess: async () => {
                setChangingEmail(false);
                logoutMutation.mutate(accessToken!, {
                    onSettled: () => {
                        router.replace('/verify?logout=true');
                    },
                });
            },
        });
    };

    const handleUpdatePasswordRequest = (data: { email: string }) => {
        reqPasswordCodeMutation.mutate(data, {
            onSuccess: () => {
                setResettingPassword(false);
                logoutMutation.mutate(accessToken!, {
                    onSettled: () => {
                        router.replace('/password-reset?logout=true');
                    },
                });
            },
            onError: (error: unknown) => {
                setResettingPassword(false);
                if (hasErrorStatus(error, 400)) {
                    alert('Invalid email');
                }
                if (hasErrorStatus(error, 403)) {
                    setErrorMessage('Demo accounts do not have permission to perform this action');
                }
            },
        });
    };

    const handleDeleteUser = () => {
        deleteUserMutation.mutate(undefined, {
            onError: (error) => {
                setDeletingAccount(false);
                if (hasErrorStatus(error, 403)) {
                    setErrorMessage(error.message);
                }
            },
        });
    };

    if (!user) {
        return null;
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your account and security settings.
                </p>
            </div>

            <div>
                <Card className="rounded-none rounded-t-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <UserAvatar user={user} className="h-10 w-10 shrink-0 text-sm" />

                            <div className="min-w-0 flex-1">
                                <h2 className="font-semibold text-foreground">Profile</h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Update your username.
                                </p>

                                <div className="mt-6">
                                    <ValidatedForm
                                        key={user.username}
                                        schema={userNameSchema}
                                        requiredFields={new Set(['username'])}
                                        onValidSubmit={handleUpdateUser}
                                        serverErrors={serverErrors}
                                        onClearServerError={clearServerErrors}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                            <FormField
                                                id="username"
                                                label="Username"
                                                defaultValue={user.username}
                                                required
                                                className="flex-1"
                                                onChange={(value) => {
                                                    setNameSaved(false);
                                                    setChangedName(value !== user.username);
                                                }}
                                            />
                                            <SettingsButton
                                                saved={nameSaved}
                                                isPending={updateUserMutation.isPending}
                                                changed={changedName}
                                            />
                                        </div>
                                    </ValidatedForm>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2 className="font-semibold text-foreground">Email</h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Update the email address for your account.
                                </p>

                                <div className="mt-6">
                                    <ValidatedForm
                                        schema={emailSchema}
                                        requiredFields={new Set(['email'])}
                                        onValidSubmit={() => {
                                            setChangingEmail(true);
                                        }}
                                        serverErrors={serverErrors}
                                        onClearServerError={clearServerErrors}
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                            <FormField
                                                id="email"
                                                label="Email address"
                                                type="email"
                                                defaultValue={user.email}
                                                required
                                                className="flex-1"
                                                onChange={(value) => {
                                                    setEmail(value);
                                                    setChangedEmail(value !== user.email);
                                                }}
                                            />

                                            <Button type="submit" disabled={!changedEmail}>
                                                <Save className="h-4 w-4" />
                                                Update email
                                            </Button>
                                        </div>
                                    </ValidatedForm>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none rounded-b-lg">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                                <KeyRound className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <h2 className="font-semibold text-foreground">Security</h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Manage your account security.
                                </p>
                                <hr className="mt-3" />

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-foreground">
                                            Password
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Request a code to reset your password.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => setResettingPassword(true)}
                                        variant="outline"
                                    >
                                        Reset password
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="mt-5 border-destructive/50 bg-destructive/5">
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-destructive">Delete account</h3>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all of your data.
                            </p>
                        </div>

                        <Button onClick={() => setDeletingAccount(true)} variant="destructive">
                            Delete account
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <ConfirmationDialog
                title={'Update email'}
                message="Changing your email address will log you out. You will be emailed a code to verify your new email address before you can log back in."
                isOpen={changingEmail}
                onOpenChange={(open) => {
                    if (!open) {
                        setChangingEmail(false);
                    }
                }}
                onCancel={() => setChangingEmail(false)}
                confirmButton={
                    <Button
                        type="button"
                        onClick={() => {
                            handleUpdateEmail({ email });
                        }}
                        disabled={updateUserEmailMutation.isPending}
                    >
                        {updateUserEmailMutation.isPending ? 'Updating...' : 'Update'}
                    </Button>
                }
            />

            <ConfirmationDialog
                title={'Reset password'}
                message="This will log you out. You will be emailed a code to reset your password "
                isOpen={resettingPassword}
                onOpenChange={(open) => {
                    if (!open) {
                        setResettingPassword(false);
                    }
                }}
                onCancel={() => setResettingPassword(false)}
                confirmButton={
                    <Button
                        type="button"
                        onClick={() => {
                            handleUpdatePasswordRequest({ email: user.email });
                        }}
                        disabled={reqPasswordCodeMutation.isPending}
                    >
                        {reqPasswordCodeMutation.isPending ? 'Requesting...' : 'Request reset code'}
                    </Button>
                }
            />

            <DeleteDialog
                isPending={deleteUserMutation.isPending}
                title="Delete Account?"
                message="Are you sure you want to delete this account? This action cannot be undone All data associated with the account will be lost."
                itemId={deletingAccount ? user.id : null}
                onCancel={() => {
                    setDeletingAccount(false);
                }}
                onConfirm={handleDeleteUser}
            />

            <ErrorDialog
                isOpen={!!errorMessage}
                onOpenChange={() => setErrorMessage(null)}
                title=""
                message={errorMessage ?? ''}
            />
        </main>
    );
}
