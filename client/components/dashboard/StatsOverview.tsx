"use client";

import { useQuery } from "@tanstack/react-query";
import {
    CalendarDays,
    TrendingUp,
    Package,
    Wallet,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { getUserStats, UserDashboardStats } from "@/api/dashboardApi";
import { StatsOverviewSkeleton } from "@/components/ui/skeleton";

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg }: StatCardProps) {
    const isPositive = change && change > 0;

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change !== undefined && (
                        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? (
                                <ArrowUpRight className="w-4 h-4" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4" />
                            )}
                            <span className="font-medium">{Math.abs(change)}%</span>
                            <span className="text-gray-400">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function StatsOverview() {
    const { data: statsData, isLoading, error } = useQuery({
        queryKey: ["userDashboardStats"],
        queryFn: getUserStats,
        staleTime: 30 * 1000, // 30 seconds
        retry: 1,
    });

    if (isLoading) {
        return <StatsOverviewSkeleton />;
    }

    // Use fetched data or fallback to zeros
    const stats: UserDashboardStats = statsData || {
        totalBookings: 0,
        completedBookings: 0,
        upcomingBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        recentActivity: 0,
    };

    const statCards: StatCardProps[] = [
        {
            title: "Total Bookings",
            value: stats.totalBookings,
            icon: Package,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-100",
        },
        {
            title: "Upcoming Moves",
            value: stats.upcomingBookings,
            icon: CalendarDays,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-100",
        },
        {
            title: "Completed",
            value: stats.completedBookings,
            icon: TrendingUp,
            iconColor: "text-green-600",
            iconBg: "bg-green-100",
        },
        {
            title: "Total Spent",
            value: formatPrice(stats.totalSpent),
            icon: Wallet,
            iconColor: "text-orange-600",
            iconBg: "bg-orange-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}
