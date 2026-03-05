"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminNavbar } from "./AdminNavbar";
import { PageLoader } from "@/components/ui/loading-animation";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // useEffect(() => {
    //     if (!isLoading && !isAuthenticated) {
    //         router.push("/");
    //     }
    //     // TODO: Add role check for admin
    // }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <PageLoader type="delivery" message="Loading admin panel..." />;
    }

    // TODO: Re-enable auth check for production
    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <AdminSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <div className="lg:hidden">
                        <AdminSidebar />
                    </div>
                </>
            )}

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen transition-all duration-300">
                <AdminNavbar onMenuClick={() => setMobileSidebarOpen(true)} />
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
