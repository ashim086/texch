import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allowedRoles={["CUSTOMER"]}>
            {children}
        </AuthGuard>
    );
}
