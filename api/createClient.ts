import createClient from 'openapi-fetch';
import type { paths } from './schema';

console.log(process.env.SERVER_URL);
export const api = createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
