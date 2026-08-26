import { AuthLayout } from '@/layouts/AuthLayout';

export default function CodeRequestLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthLayout showTagline={false}>
            <div className="mb-6 text-center">
                <p className="mt-2 text-md">Enter your email below to request a code</p>
            </div>
            {children}
        </AuthLayout>
    );
}
