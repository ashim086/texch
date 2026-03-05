"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Search, Menu } from "lucide-react";
import { useState } from "react";

interface DashboardNavbarProps {
    onMenuClick?: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);

    const displayName = user?.name || "Guest User";
    const displayEmail = user?.email || "guest@example.com";

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left Section - Mobile Menu & Search */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 w-80">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings, services..."
                            className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-gray-400"
                        />
                        <kbd className="hidden lg:inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Right Section - Profile & Notifications */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <NotificationItem
                                        title="Booking Confirmed"
                                        message="Your move to Manchester has been confirmed"
                                        time="2 hours ago"
                                        unread
                                    />
                                    <NotificationItem
                                        title="Driver Assigned"
                                        message="Tom Driver will handle your relocation"
                                        time="5 hours ago"
                                        unread
                                    />
                                    <NotificationItem
                                        title="Payment Received"
                                        message="Payment of A$450 has been processed"
                                        time="1 day ago"
                                    />
                                </div>
                                <div className="px-4 py-2 border-t border-gray-100">
                                    <button className="text-sm text-primary font-medium hover:underline">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200" />

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">
                                {displayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-32">
                                {displayEmail}
                            </p>
                        </div>

                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

// Notification Item Component
function NotificationItem({
    title,
    message,
    time,
    unread,
}: {
    title: string;
    message: string;
    time: string;
    unread?: boolean;
}) {
    return (
        <div
            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${unread ? "bg-primary/5" : ""
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${unread ? "bg-primary" : "bg-transparent"
                        }`}
                />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500 truncate">{message}</p>
                    <p className="text-xs text-gray-400 mt-1">{time}</p>
                </div>
            </div>
        </div>
    );
}
