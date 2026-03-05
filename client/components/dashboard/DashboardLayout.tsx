"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/loading-animation";

interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // TODO: Re-enable for production
    // useEffect(() => {
    //     if (!isLoading && !isAuthenticated) {
    //         router.push("/");
    //     }
    // }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <PageLoader type="delivery" message="Loading dashboard..." />;
    }

    // TODO: Re-enable auth check for production
    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <DashboardSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <div className="lg:hidden">
                        <DashboardSidebar />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen transition-all duration-300">
                <DashboardNavbar onMenuClick={() => setMobileSidebarOpen(true)} />
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
