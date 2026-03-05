"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Bell, Search, Menu, Settings } from "lucide-react";
import { getAdminStats } from "@/api/dashboardApi";
import { useState } from "react";

interface AdminNavbarProps {
    onMenuClick?: () => void;
}

export function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const { data: stats } = useQuery({
        queryKey: ["adminNavStats"],
        queryFn: getAdminStats,
        staleTime: 60 * 1000,
        retry: 1,
    });

    const displayName = user?.name || "Admin";

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-96">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings, customers, drivers..."
                            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {/* Quick Stats */}
                    <div className="hidden lg:flex items-center gap-6 mr-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Monthly Revenue</p>
                            <p className="text-sm font-bold text-green-600">
                                {stats ? `A$${stats.monthlyRevenue.toLocaleString()}` : "--"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500">Pending Quotes</p>
                            <p className="text-sm font-bold text-orange-600">
                                {stats?.pendingQuotes ?? "--"}
                            </p>
                        </div>
                    </div>

                    {/* Settings */}
                    <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
                        <Settings className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                    <h3 className="font-semibold text-gray-900">Admin Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <AdminNotification
                                        title="New Quote Request"
                                        message="Sarah Wilson submitted a quote for Edinburgh → Glasgow"
                                        time="5 min ago"
                                        type="quote"
                                    />
                                    <AdminNotification
                                        title="Booking Confirmed"
                                        message="Payment received for booking #8a3f2d"
                                        time="15 min ago"
                                        type="booking"
                                    />
                                    <AdminNotification
                                        title="Driver Available"
                                        message="Tom Driver completed his move and is now available"
                                        time="30 min ago"
                                        type="driver"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200" />

                    {/* Admin Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function AdminNotification({
    title,
    message,
    time,
    type,
}: {
    title: string;
    message: string;
    time: string;
    type: "quote" | "booking" | "driver";
}) {
    const typeColors = {
        quote: "bg-orange-500",
        booking: "bg-green-500",
        driver: "bg-blue-500",
    };

    return (
        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
            <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[type]}`} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{message}</p>
                    <p className="text-xs text-gray-400 mt-1">{time}</p>
                </div>
            </div>
        </div>
    );
}
