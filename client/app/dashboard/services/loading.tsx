import { SectionLoader } from "@/components/ui/loading-animation";

export default function ServicesLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <SectionLoader
                type="holiday"
                message="Loading services..."
                minHeight="min-h-[400px]"
            />
        </div>
    );
}
