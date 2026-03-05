import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ServicesContent } from "./_components/ServicesContent";

// Server component for SSR
export default function ServicesPage() {
    return (
        <DashboardLayout>
            <ServicesContent />
        </DashboardLayout>
    );
}
