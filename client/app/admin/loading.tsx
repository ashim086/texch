import { SectionLoader } from "@/components/ui/loading-animation";

export default function AdminLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <SectionLoader
                type="delivery"
                message="Loading admin dashboard..."
                minHeight="min-h-[400px]"
            />
        </div>
    );
}
