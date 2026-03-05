"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    MessageCircle,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Truck,
} from "lucide-react";
import { LogoutConfirmDialog } from "@/components/shared/LogoutConfirmDialog";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/api/dashboardApi";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    badgeKey?: string;
}

const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "All Bookings", href: "/admin/bookings", icon: Package, badgeKey: "inProgressBookings" },
    { label: "Chat", href: "/admin/chat", icon: MessageCircle, badgeKey: "unreadMessages" },
    { label: "Customers", href: "/admin/customers", icon: Users, badgeKey: "totalCustomers" },
];

const bottomNavItems: NavItem[] = [
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Fetch admin stats for notification badges
    const { data: stats } = useQuery({
        queryKey: ["adminStats"],
        queryFn: getAdminStats,
        staleTime: 30000, // Cache for 30 seconds
        refetchInterval: 60000, // Refetch every minute
    });

    // Create badge counts map
    const badgeCounts = useMemo(() => ({
        inProgressBookings: stats?.inProgressBookings || 0,
        unreadMessages: 0, // TODO: Add chat API for unread count
        totalCustomers: stats?.totalCustomers || 0,
    }), [stats]);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-gray-900 transition-all duration-300 flex flex-col",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <div>
                            <span className="font-bold text-lg text-white">NNR</span>
                            <p className="text-xs text-gray-400">Admin Panel</p>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const badgeCount = item.badgeKey ? badgeCounts[item.badgeKey as keyof typeof badgeCounts] : 0;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && (
                                <>
                                    <span className="font-medium">{item.label}</span>
                                    {badgeCount > 0 && (
                                        <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-primary text-white"
                                            }`}>
                                            {badgeCount}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && badgeCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {badgeCount > 9 ? "9+" : badgeCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-gray-800 space-y-1">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}

                {/* Logout Button */}
                <LogoutConfirmDialog collapsed={collapsed} variant="admin" />
            </div>
        </aside>
    );
}
