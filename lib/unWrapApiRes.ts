export default async function unwrapApiRes<T>(
    request: Promise<{
        data?: T;
        error?: { message: string };
    }>,
) {
    const response = await request;
    if (response.error) {
        alert(response.error.message);
        throw new Error(response.error.message);
    }

    if (!response.data) {
        throw new Error('Malformed response');
    }

    return response.data;
}
