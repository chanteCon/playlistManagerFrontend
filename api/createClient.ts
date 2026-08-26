import createClient from 'openapi-fetch';

import type { paths } from './schema';
import { authMiddleware } from '@/requests/authMiddleware';

const createApiClient = () =>
    createClient<paths>({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
    });

export const publicApi = createApiClient();

export const protectedApi = createApiClient();

protectedApi.use(authMiddleware);
