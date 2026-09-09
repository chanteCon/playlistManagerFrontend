type AuthHandlers = {
    getAccessToken: () => string | null;
};

let authHandlers: AuthHandlers | null = null;

export const middlewareAuthHandler = (handlers: AuthHandlers) => {
    authHandlers = handlers;
};

export const authMiddleware = {
    onRequest({ request }: { request: Request }) {
        const accessToken = authHandlers?.getAccessToken();
        if (accessToken) {
            request.headers.set('Authorization', `Bearer ${accessToken}`);
        }

        return request;
    },
};
