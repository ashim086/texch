import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardContent } from "./_components/DashboardContent";

// Server component wrapper for SSR optimization
export default function DashboardPage() {
    return (
        <DashboardLayout>
            <DashboardContent />
        </DashboardLayout>
    );
}
