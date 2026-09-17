import { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { hasErrorStatus, isHandledError } from '@/lib/utils';
import {
    deleteUser,
    getUser,
    logout,
    patchUser,
    patchUserEmail,
} from '@/requests/protectedRequests';
import { passwordResetCode } from '@/requests/publicRequests';
import { User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
    type GetUserResponse =
        paths['/api/users/me']['get']['responses']['200']['content']['application/json'];
    const { accessToken, isAuthPending, clearAccessToken } = useAuth();

    type UserUpdate = Partial<GetUserResponse['data']['user']>;

    const logoutMutation = useMutation({
        mutationFn: logout,
    });

    const handleUserDeleted = (error: unknown) => {
        if (hasErrorStatus(error, 404)) {
            clearAccessToken();
        }
    };

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryFn: async () => {
            try {
                return await getUser();
            } catch (error) {
                handleUserDeleted(error);
                throw error;
            }
        },
        queryKey: ['user'],
        enabled: !!accessToken && !isAuthPending,
        staleTime: 5 * 60 * 1000,
    });

    function updateCachedUser(userUpdate: UserUpdate) {
        queryClient.setQueryData<GetUserResponse>(['user'], (current) => {
            if (!current) return current;

            return {
                ...current,
                data: {
                    ...current.data,
                    user: {
                        ...current.data.user,
                        ...userUpdate,
                    },
                },
            };
        });
    }

    const updateUserMutation = useMutation({
        mutationFn: patchUser,
        onSuccess: (res) => {
            if (!res) return;

            updateCachedUser(res.data.user);
        },
        onError: handleUserDeleted,
    });

    const updateUserEmailMutation = useMutation({
        mutationFn: patchUserEmail,
        onError: handleUserDeleted,
    });

    const reqPasswordCodeMutation = useMutation({
        mutationFn: passwordResetCode,
        onError: handleUserDeleted,
        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400]);
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSettled: clearAccessToken,
    });

    return {
        user: data?.data?.user as User | undefined,
        updateUserMutation,
        updateUserEmailMutation,
        logoutMutation,
        reqPasswordCodeMutation,
        deleteUserMutation,
    };
}
