import { AppBrand } from '../components/common/AppBrand';
import { AuthCard } from '../components/auth/AuthCard';

type AuthLayoutProps = {
    children: React.ReactNode;
    showTagline?: boolean;
};

export function AuthLayout({ children, showTagline = true }: AuthLayoutProps) {
    return (
        <>
            <AppBrand showTagline={showTagline} />

            <AuthCard>{children}</AuthCard>
        </>
    );
}
