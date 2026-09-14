import z from 'zod';

export const editSchema = z
    .object({ title: z.string().max(200), description: z.string().max(500) })
    .passthrough();

export const uuidSchema = z.string().uuid();
