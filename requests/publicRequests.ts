import { schemas } from '@/api/zod';
import { apiRequest } from '@/lib/apiRequest';
import { z } from 'zod';
import { publicApi } from '@/api/createClient';
import { codeSchema } from '@/schemas/authSchemas';

type RegisterInput = z.infer<typeof schemas.postApiauthregister_Body>;
type Email = Pick<RegisterInput, 'email'>;

export const register = (data: RegisterInput) =>
    apiRequest(
        publicApi.POST('/api/auth/register', {
            body: data,
        }),
    );

type LoginInput = z.infer<typeof schemas.postApiauthlogin_Body>;
export const login = (data: LoginInput) =>
    apiRequest(
        publicApi.POST('/api/auth/login', {
            body: data,
        }),
    );

type CodeInput = z.infer<typeof codeSchema>;
export const verify = (data: CodeInput) =>
    apiRequest(publicApi.PATCH('/api/auth/verify', { body: data, credentials: 'include' }));

type PasswordResetInput = CodeInput & {
    password: string;
};
export const passwordReset = (data: PasswordResetInput) =>
    apiRequest(publicApi.PATCH('/api/auth/password-reset', { body: data }));

export const loginMFA = (data: CodeInput) =>
    apiRequest(publicApi.POST('/api/auth/login/MFA', { body: data, credentials: 'include' }));

export const verificationCode = (data: Email) =>
    apiRequest(publicApi.POST('/api/auth/verification-code-request', { body: data }));

export const passwordResetCode = (data: Email) =>
    apiRequest(publicApi.POST('/api/auth/password-reset-request', { body: data }));

export const refresh = () =>
    apiRequest(publicApi.POST('/api/auth/refresh', { credentials: 'include' }));
