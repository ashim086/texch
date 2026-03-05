"use client";

import { useAuth } from "@/context/AuthContext";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { RecentBookings } from "@/components/dashboard/RecentBookings";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingMoves } from "@/components/dashboard/UpcomingMoves";
import { ServiceHighlights } from "@/components/dashboard/ServiceHighlights";
import { Sparkles } from "lucide-react";

export function DashboardContent() {
    const { user } = useAuth();

    const greeting = getGreeting();
    const firstName = user?.name?.split(" ")[0] || "there";

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-linear-to-r from-primary/10 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm text-gray-600">{greeting}</span>
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Welcome back, {firstName}!
                        </h1>
                        <p className="mt-1 text-gray-600">
                            Here&apos;s what&apos;s happening with your moves today.
                        </p>
                    </div>
                    <div className="hidden lg:block">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center text-white text-4xl font-bold">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                            <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <StatsOverview />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">
                    <RecentBookings limit={3} />
                    <ServiceHighlights />
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                    <QuickActions />
                    <UpcomingMoves />
                </div>
            </div>
        </div>
    );
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}
