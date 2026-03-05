import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminChatContent } from "./_components/AdminChatContent";

// Server component for SSR
export default function AdminChatPage() {
    return (
        <AdminLayout>
            <AdminChatContent />
        </AdminLayout>
    );
}
