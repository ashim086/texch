import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ChatContent } from "./_components/ChatContent";

// Server component for SSR
export default function ChatPage() {
    return (
        <DashboardLayout>
            <ChatContent />
        </DashboardLayout>
    );
}
