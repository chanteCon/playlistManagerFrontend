export default async function unwrapApiRes<T>(
    request: Promise<{
        data?: T;
        error?: { message: string };
    }>,
) {
    const response = await request;

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data;
}
