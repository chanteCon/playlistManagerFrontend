import { paths } from '@/api/schema';
import { useAuth } from '@/contexts/AuthContext';
import { isHandledError } from '@/lib/utils';
import { getUser, logout, patchUser, patchUserEmail } from '@/requests/protectedRequests';
import { passwordResetCode } from '@/requests/publicRequests';
import { User } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfile() {
    type GetUserResponse =
        paths['/api/users/me']['get']['responses']['200']['content']['application/json'];
    const { accessToken, isAuthPending } = useAuth();

    type UserUpdate = Partial<GetUserResponse['data']['user']>;

    const logoutMutation = useMutation({
        mutationFn: logout,
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

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryFn: async () => {
            try {
                return await getUser();
            } catch (error) {
                throw error;
            }
        },
        queryKey: ['user'],
        enabled: !!accessToken && !isAuthPending,
        staleTime: 5 * 60 * 1000,
    });

    const updateUserMutation = useMutation({
        mutationFn: patchUser,
        onSuccess: (res) => {
            if (!res) return;

            updateCachedUser(res.data.user);
        },
    });

    const updateUserEmailMutation = useMutation({
        mutationFn: patchUserEmail,
    });

    const reqPasswordCodeMutation = useMutation({
        mutationFn: passwordResetCode,
        throwOnError: (error: unknown) => {
            return !isHandledError(error, [400]);
        },
    });

    return {
        user: data?.data?.user as User | undefined,
        updateUserMutation,
        updateUserEmailMutation,
        logoutMutation,
        reqPasswordCodeMutation,
    };
}
