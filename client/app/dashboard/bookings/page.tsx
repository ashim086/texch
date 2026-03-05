import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BookingsContent } from "./_components/BookingsContent";

// Server component for SSR
export default function BookingsPage() {
    return (
        <DashboardLayout>
            <BookingsContent />
        </DashboardLayout>
    );
}
