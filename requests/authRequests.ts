import { schemas } from '@/api/zod';
import unwrapApiRes from '@/lib/unWrapApiRes';
import { z } from 'zod';
import { api } from '@/api/createClient';
import { codeSchema } from '@/schemas/authSchemas';

type RegisterInput = z.infer<typeof schemas.postApiauthregister_Body>;
type Email = Pick<RegisterInput, 'email'>;

export const register = (data: RegisterInput) =>
    unwrapApiRes(
        api.POST('/api/auth/register', {
            body: data,
        }),
    );

type LoginInput = z.infer<typeof schemas.postApiauthlogin_Body>;
export const login = (data: LoginInput) =>
    unwrapApiRes(
        api.POST('/api/auth/login', {
            body: data,
        }),
    );

type CodeInput = z.infer<typeof codeSchema>;
export const verify = (data: CodeInput) =>
    unwrapApiRes(api.PATCH('/api/auth/verify', { body: data, credentials: 'include' }));

type PasswordResetInput = CodeInput & {
    password: string;
};
export const passwordReset = (data: PasswordResetInput) =>
    unwrapApiRes(api.PATCH('/api/auth/password-reset', { body: data }));

export const loginMFA = (data: CodeInput) =>
    unwrapApiRes(api.POST('/api/auth/login/MFA', { body: data, credentials: 'include' }));

export const verificationCode = (data: Email) =>
    unwrapApiRes(api.POST('/api/auth/verification-code-request', { body: data }));

export const passwordResetCode = (data: Email) =>
    unwrapApiRes(api.POST('/api/auth/password-reset-request', { body: data }));

export const refresh = () =>
    unwrapApiRes(api.POST('/api/auth/refresh', { credentials: 'include' }));
