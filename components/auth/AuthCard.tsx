import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuthCardProps = {
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export function AuthCard({ title = '', children, className }: AuthCardProps) {
    return (
        <Card className={`w-[448px] max-w-[calc(100vw-2rem)]`}>
            <CardHeader className="text-center">
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent className={className}>{children}</CardContent>
        </Card>
    );
}
