import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const postApiauthregister_Body = z
    .object({
        email: z
            .string()
            .regex(
                /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
            )
            .email(),
        password: z
            .string()
            .min(6)
            .max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]{6,}$/,
            ),
        username: z
            .string()
            .min(5)
            .max(30)
            .regex(/^[a-zA-Z0-9._-]+$/),
    })
    .passthrough();
const postApiauthlogin_Body = z
    .object({
        email: z
            .string()
            .regex(
                /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
            )
            .email(),
        password: z.string(),
    })
    .passthrough();
const patchApiauthpasswordReset_Body = z
    .object({
        code: z.string().min(6).max(6),
        password: z
            .string()
            .min(6)
            .max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?])[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]{6,}$/,
            ),
    })
    .passthrough();
const postApiplaylists_Body = z
    .object({ name: z.string().min(1).max(50), description: z.string().max(500).optional() })
    .passthrough();
const patchApiplaylistsId_Body = z
    .object({ name: z.string().min(1).max(50), description: z.string().max(500) })
    .partial()
    .passthrough();
const patchApiplaylistsIdvideosPlaylistVideoId_Body = z
    .object({ title: z.string().min(1).max(50), description: z.string().max(500) })
    .partial()
    .passthrough();

export const schemas = {
    postApiauthregister_Body,
    postApiauthlogin_Body,
    patchApiauthpasswordReset_Body,
    postApiplaylists_Body,
    patchApiplaylistsId_Body,
    patchApiplaylistsIdvideosPlaylistVideoId_Body,
};

const endpoints = makeApi([
    {
        method: 'post',
        path: '/api/auth/login',
        alias: 'postApiauthlogin',
        description: `Sends a verification code for login to user email`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: postApiauthlogin_Body,
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Incorrect email or password`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Incorrect email or password'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 403,
                description: `Email not verified`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Email not verified'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/login/MFA',
        alias: 'postApiauthloginMFA',
        description: `User can enter log in code`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z.object({ code: z.string().min(6).max(6) }).passthrough(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({ accessToken: z.string() }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Invalid or expired login code`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid or expired login code'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/logout',
        alias: 'postApiauthlogout',
        description: `Clears refresh cookie on logout`,
        requestFormat: 'json',
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/auth/password-reset',
        alias: 'patchApiauthpasswordReset',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: patchApiauthpasswordReset_Body,
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Invalid or expired password reset code.`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid or expired password reset code.'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/password-reset-request',
        alias: 'postApiauthpasswordResetRequest',
        description: `Issues a code to reset password and emails to user. 
                Reset password with this code at /api/auth/password-reset.`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z
                    .object({
                        email: z
                            .string()
                            .regex(
                                /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
                            )
                            .email(),
                    })
                    .passthrough(),
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/refresh',
        alias: 'postApiauthrefresh',
        description: `Issues new access token and refresh token cookie.             Refresh token cookie must be included in the request. User must be             verified. Generic 401 error if token invalid or user not verified.`,
        requestFormat: 'json',
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({ accessToken: z.string() }),
        }),
        errors: [
            {
                status: 401,
                description: `Invalid token`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid token'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/register',
        alias: 'postApiauthregister',
        description: `Creates a new user account and sends a verification code to user. Verify email at api/auth/verify.`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: postApiauthregister_Body,
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 409,
                description: `Email already in use`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Email already in use'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/auth/verification-code-request',
        alias: 'postApiauthverificationCodeRequest',
        description: `Issues a code to verify email and emails to user.                  Verify email with this code at /api/auth/verify.`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z
                    .object({
                        email: z
                            .string()
                            .regex(
                                /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
                            )
                            .email(),
                    })
                    .passthrough(),
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/auth/verify',
        alias: 'patchApiauthverify',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z.object({ code: z.string().min(6).max(6) }).passthrough(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({ accessToken: z.string() }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Invalid or expired verification code.`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid or expired verification code.'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/playlists/',
        alias: 'postApiplaylists',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: postApiplaylists_Body,
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                playlist: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    userId: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    name: z.string(),
                    description: z.union([z.string(), z.null()]),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 409,
                description: `You have another playlist with this name`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('You have another playlist with this name'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'get',
        path: '/api/playlists/',
        alias: 'getApiplaylists',
        requestFormat: 'json',
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                playlists: z.array(
                    z.object({
                        id: z
                            .string()
                            .regex(
                                /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                            )
                            .uuid(),
                        userId: z
                            .string()
                            .regex(
                                /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                            )
                            .uuid(),
                        name: z.string(),
                        description: z.union([z.string(), z.null()]),
                    }),
                ),
            }),
        }),
        errors: [
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'get',
        path: '/api/playlists/:id',
        alias: 'getApiplaylistsId',
        requestFormat: 'json',
        parameters: [
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                playlist: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    name: z.string(),
                    description: z.union([z.string(), z.null()]).optional(),
                    videos: z.array(
                        z.object({
                            id: z
                                .string()
                                .regex(
                                    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                                )
                                .uuid(),
                            title: z.string(),
                            description: z.string().optional(),
                            thumbnail: z.string().optional(),
                            url: z.string(),
                            platform: z.union([z.string(), z.null()]).optional(),
                            platformId: z.union([z.string(), z.null()]).optional(),
                            render: z.boolean(),
                        }),
                    ),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/playlists/:id',
        alias: 'patchApiplaylistsId',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: patchApiplaylistsId_Body,
            },
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                playlist: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    userId: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    name: z.string(),
                    description: z.union([z.string(), z.null()]),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 409,
                description: `You have another playlist with this name`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('You have another playlist with this name'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'delete',
        path: '/api/playlists/:id',
        alias: 'deleteApiplaylistsId',
        requestFormat: 'json',
        parameters: [
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'post',
        path: '/api/playlists/:id/videos',
        alias: 'postApiplaylistsIdvideos',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z.object({ url: z.string().url() }).passthrough(),
            },
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                video: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    title: z.string(),
                    description: z.string().optional(),
                    thumbnail: z.string().optional(),
                    url: z.string(),
                    platform: z.union([z.string(), z.null()]).optional(),
                    platformId: z.union([z.string(), z.null()]).optional(),
                    render: z.boolean(),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid input or nnable to process video URL`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid input or nnable to process video URL'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist or Viideo not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist or Viideo not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 409,
                description: `You have already added this video to the playlist`,
                schema: z.object({
                    success: z.boolean(),
                    message: z
                        .string()
                        .default('You have already added this video to the playlist'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 502,
                description: `Unable to fetch video metadata. Please try again later.`,
                schema: z.object({
                    success: z.boolean(),
                    message: z
                        .string()
                        .default('Unable to fetch video metadata. Please try again later.'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/playlists/:id/videos/:playlistVideoId',
        alias: 'patchApiplaylistsIdvideosPlaylistVideoId',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: patchApiplaylistsIdvideosPlaylistVideoId_Body,
            },
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
            {
                name: 'playlistVideoId',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                video: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    title: z.string(),
                    description: z.string().optional(),
                    thumbnail: z.string().optional(),
                    url: z.string(),
                    platform: z.union([z.string(), z.null()]).optional(),
                    platformId: z.union([z.string(), z.null()]).optional(),
                    render: z.boolean(),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'delete',
        path: '/api/playlists/:id/videos/:playlistVideoId',
        alias: 'deleteApiplaylistsIdvideosPlaylistVideoId',
        requestFormat: 'json',
        parameters: [
            {
                name: 'id',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
            {
                name: 'playlistVideoId',
                type: 'Path',
                schema: z
                    .string()
                    .regex(
                        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                    )
                    .uuid(),
            },
        ],
        response: z.void(),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `Playlist not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Playlist not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'get',
        path: '/api/users/me',
        alias: 'getApiusersme',
        requestFormat: 'json',
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                user: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    username: z.unknown(),
                    email: z
                        .string()
                        .regex(
                            /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
                        )
                        .email(),
                }),
            }),
        }),
        errors: [
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `User not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('User not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/users/me',
        alias: 'patchApiusersme',
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z
                    .object({
                        username: z
                            .string()
                            .min(5)
                            .max(30)
                            .regex(/^[a-zA-Z0-9._-]+$/),
                    })
                    .passthrough(),
            },
        ],
        response: z.object({
            success: z.boolean(),
            message: z.union([z.string(), z.null()]),
            data: z.object({
                user: z.object({
                    id: z
                        .string()
                        .regex(
                            /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,
                        )
                        .uuid(),
                    username: z.unknown(),
                }),
            }),
        }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `User not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('User not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'delete',
        path: '/api/users/me',
        alias: 'deleteApiusersme',
        requestFormat: 'json',
        response: z.void(),
        errors: [
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `User not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('User not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
    {
        method: 'patch',
        path: '/api/users/update-email',
        alias: 'patchApiusersupdateEmail',
        description: `Sends new verification code to provided email address, 
            resets user to unverified state. Verify at /api/auth/verify`,
        requestFormat: 'json',
        parameters: [
            {
                name: 'body',
                type: 'Body',
                schema: z
                    .object({
                        email: z
                            .string()
                            .regex(
                                /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
                            )
                            .email(),
                    })
                    .passthrough(),
            },
        ],
        response: z.object({ success: z.boolean(), message: z.string(), data: z.unknown() }),
        errors: [
            {
                status: 400,
                description: `Invalid Input`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Invalid Input'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 401,
                description: `Unauthorized`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Unauthorized'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 404,
                description: `User not found`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('User not found'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
            {
                status: 409,
                description: `Email already in use`,
                schema: z.object({
                    success: z.boolean(),
                    message: z.string().default('Email already in use'),
                    data: z.null(),
                    errors: z.union([z.unknown(), z.null()]).optional(),
                }),
            },
        ],
    },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
    return new Zodios(baseUrl, endpoints, options);
}
