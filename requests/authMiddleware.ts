type AuthHandlers = {
    accessToken: string | null;
};

let authHandlers: AuthHandlers | null = null;

export const middlewareAuthHandler = (handlers: AuthHandlers) => {
    authHandlers = handlers;
};

export const authMiddleware = {
    onRequest({ request }: { request: Request }) {
        const accessToken = authHandlers?.accessToken;

        if (!accessToken) {
        }
        request.headers.set('Authorization', `Bearer ${accessToken}`);

        return request;
    },
};
