import { refreshOnce } from '@/lib/utils';

type ApiResponse<T> = {
    data?: T;
    error?: {
        message: string;
        status?: number;
    };
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

export async function apiRequest<T>(
    request: Promise<{
        data?: T;
        error?: {
            message: string;
            status?: number;
        };
    }>,
) {
    const response = await request;

    return parseResponse(response);
}

let clearAccessToken: (() => void) | null = null;

export const registerAuthHandler = (handler: () => void) => {
    clearAccessToken = handler;
};

export async function authenticatedApiRequest<T>(request: () => Promise<ApiResponse<T>>) {
    let response = await request();

    if (response.error?.status === 401) {
        try {
            await refreshOnce();
        } catch (error) {
            clearAccessToken?.();
            throw error;
        }

        response = await request();

        if (response.error?.status === 401) {
            clearAccessToken?.();
        }
    }

    return parseResponse(response);
}
