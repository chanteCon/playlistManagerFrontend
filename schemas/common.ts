import z from 'zod';

export const editSchema = z
    .object({ title: z.string().max(200), description: z.string().max(500) })
    .passthrough();

export const uuidSchema = z.string().uuid();

export const userNameSchema = z.object({
    username: z
        .string()
        .min(5)
        .max(30)
        .regex(/^[a-zA-Z0-9._-]+$/),
});
