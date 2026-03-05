import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboardContent } from "./_components/AdminDashboardContent";

// Server component for SSR
export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <AdminDashboardContent />
        </AdminLayout>
    );
}
