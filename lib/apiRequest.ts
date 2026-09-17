import { refreshOnce } from '@/lib/utils';

type AuthHandlers = {
    updateAccessToken: (token: string) => void;
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
        errors?: unknown;
    };
    response: Response;
};

export class RequestError extends Error {
    status: number;
    fieldErrors: Record<string, string>;

    constructor(message: string, status: number, errors: Record<string, string> = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.fieldErrors = errors;
    }
}

const parseResponse = <T>(response: ApiResponse<T>) => {
    if (response.error) {
        const errors =
            response.error.errors && typeof response.error.errors === 'object'
                ? Object.fromEntries(
                      Object.entries(response.error.errors).map(([field, reasons]) => [
                          field,
                          Array.isArray(reasons) ? reasons[0] : String(reasons),
                      ]),
                  )
                : {};
        throw new RequestError(response.error.message, response.response.status, errors);
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
    let response = await request();

    if (response.response?.status === 404 && response.error?.message === 'User not found') {
        authHandlers?.clearAccessToken?.();
    } else if (response.response?.status === 401) {
        try {
            const refreshResponse = await refreshOnce();
            authHandlers?.updateAccessToken(refreshResponse.data.accessToken);
        } catch (error) {
            authHandlers?.clearAccessToken?.();
            throw error;
        }

        response = await request();

        if (response.response?.status === 401) {
            authHandlers?.clearAccessToken?.();
        }
    } else if (response.response.status === 204) {
        return undefined;
    }

    return parseResponse(response);
}
