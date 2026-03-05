import { SectionLoader } from "@/components/ui/loading-animation";

export default function Loading() {
    return (
        <SectionLoader
            type="delivery"
            message="Loading customers..."
        />
    );
}
