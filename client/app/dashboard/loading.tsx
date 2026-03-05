import { SectionLoader } from "@/components/ui/loading-animation";

export default function DashboardLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <SectionLoader
                type="delivery"
                message="Loading your dashboard..."
                minHeight="min-h-[400px]"
            />
        </div>
    );
}
