'use client';
import CodeForm from '@/components/forms/codeForm';
import { codeSchema } from '@/schemas/authSchemas';

export default function LoginMfa() {
    return (
        <CodeForm
            title="Login code"
            instructions="Enter the 6-digit code sent to your email"
            schema={codeSchema}
            onValidSubmit={() => alert('submitted')}
        />
    );
}
