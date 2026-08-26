import { refreshOnce } from '@/lib/utils';
type AuthHandlers = {
    setAccessToken: (token: string) => void;
    clearAccessToken: () => void;
};

let authHandlers: AuthHandlers | null = null;

export const registerAuthHandler = (handlers: AuthHandlers) => {
    authHandlers = handlers;
};
type ApiResponse<T> = {
    data?: T;
    error?: {
        message: string;
        status?: number;
    };
    response: Response;
};

const parseResponse = <T>(response: ApiResponse<T>) => {
    if (response.error) {
        throw new Error(response.error.message);
    }

    if (!response.data) {
        throw new Error('Malformed response');
    }

    return response.data;
};

export async function apiRequest<T>(request: Promise<ApiResponse<T>>) {
    const response = await request;
    return parseResponse(response);
}

export async function authenticatedApiRequest<T>(request: () => Promise<ApiResponse<T>>) {
    console.log('AUTH REQUEST START');

    let response;

    response = await request();

    console.log('AUTH REQUEST RESPONSE', response.response.status);

    if (response.response?.status === 401) {
        try {
            const refreshResponse = await refreshOnce();
            authHandlers?.setAccessToken(refreshResponse.data.accessToken);
        } catch (error) {
            authHandlers?.clearAccessToken?.();
            throw error;
        }

        response = await request();

        if (response.error?.status === 401) {
            authHandlers?.clearAccessToken?.();
        }
    }

    return parseResponse(response);
}
