'use client';
import CodeInputLayout from '../layout';
import { z } from 'zod';

const schema = z
    .object({
        code: z.string().length(6),
    })
    .passthrough();

export default function Verify() {
    return (
        <CodeInputLayout
            title="Verification code"
            instructions="Enter the 6-digit code sent to your email"
            schema={schema}
            onValidSubmit={() => alert('submitted')}
        />
    );
}
