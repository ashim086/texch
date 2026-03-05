import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminBookingsContent } from "./_components/AdminBookingsContent";

// Server component for SSR
export default function AdminBookingsPage() {
    return (
        <AdminLayout>
            <AdminBookingsContent />
        </AdminLayout>
    );
}
