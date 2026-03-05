"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    CalendarDays,
    MessageCircle,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Truck,
} from "lucide-react";
import { LogoutConfirmDialog } from "@/components/shared/LogoutConfirmDialog";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/api/dashboardApi";

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
    badgeKey?: string;
}

const userNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays, badgeKey: "upcomingBookings" },
    { label: "Services", href: "/dashboard/services", icon: Package },
    { label: "Chat", href: "/dashboard/chat", icon: MessageCircle, badgeKey: "unreadMessages" },
];

const bottomNavItems: NavItem[] = [
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help", href: "/dashboard/help", icon: HelpCircle },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // Fetch user stats for notification badges
    const { data: stats } = useQuery({
        queryKey: ["userStats"],
        queryFn: getUserStats,
        staleTime: 30000, // Cache for 30 seconds
        refetchInterval: 60000, // Refetch every minute
    });

    // Create badge counts map
    const badgeCounts = useMemo(() => ({
        upcomingBookings: stats?.upcomingBookings || 0,
        unreadMessages: 0, // TODO: Add chat API for unread count
    }), [stats]);

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-xl text-gray-900">NNR</span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
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
                {userNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    const badgeCount = item.badgeKey ? badgeCounts[item.badgeKey as keyof typeof badgeCounts] : 0;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 shrink-0",
                                    isActive && "text-primary"
                                )}
                            />
                            {!collapsed && (
                                <>
                                    <span className="font-medium">{item.label}</span>
                                    {badgeCount > 0 && (
                                        <span className="ml-auto bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                            {badgeCount}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && badgeCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {badgeCount}
                                </span>
                            )}
                            {/* Active indicator */}
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-gray-100 space-y-1">
                {bottomNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}

                {/* Logout Button */}
                <LogoutConfirmDialog collapsed={collapsed} variant="user" />
            </div>
        </aside>
    );
}
