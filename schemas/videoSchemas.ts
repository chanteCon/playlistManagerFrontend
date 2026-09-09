import z from 'zod';

export const addVideoSchema = z.object({ url: z.string().url() }).passthrough();
