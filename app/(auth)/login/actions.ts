'use server';
import { z } from 'zod';

import { schemas } from '@/api/zod';
import { api } from '@/api/createClient';

type LoginInput = z.infer<typeof schemas.postApiauthlogin_Body>;

export async function handleSubmit(data: LoginInput) {
    console.log('SERVER URL:', process.env.SERVER_URL);
    const { data: response, error } = await api.POST('/api/auth/login', {
        body: data,
    });

    if (error) {
        console.log(error);
        return;
    }

    console.log(response);
}
