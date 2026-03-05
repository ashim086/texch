"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    Package,
    Users,
    Truck,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Clock,
    Star,
    ArrowRight,
    MapPin,
} from "lucide-react";
import { Booking, BookingStatus, HouseSize } from "@/api/bookingApi";
import {
    getAdminStats,
    getAdminRecentBookings,
    getAdminPendingQuotes,
    AdminDashboardStats,
} from "@/api/dashboardApi";
import {
    AdminStatsOverviewSkeleton,
    AdminBookingTableSkeleton,
    PendingQuotesSkeleton,
    Skeleton,
} from "@/components/ui/skeleton";

// Helper functions
function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
    });
}

function getStatusColor(status: BookingStatus): string {
    const colors: Record<BookingStatus, string> = {
        REQUESTED: "bg-yellow-50 text-yellow-700 border-yellow-200",
        CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
        ASSIGNED: "bg-purple-50 text-purple-700 border-purple-200",
        IN_TRANSIT: "bg-orange-50 text-orange-700 border-orange-200",
        COMPLETED: "bg-green-50 text-green-700 border-green-200",
        CANCELLED: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[status] || "bg-gray-50 text-gray-700 border-gray-200";
}

function getHouseSizeLabel(size: HouseSize): string {
    const labels: Record<HouseSize, string> = {
        ONE_BHK: "1 BHK",
        TWO_BHK: "2 BHK",
        THREE_BHK: "3 BHK",
        OFFICE: "Office",
    };
    return labels[size] || size;
}

export function AdminDashboardContent() {
    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ["adminStats"],
        queryFn: getAdminStats,
        staleTime: 30 * 1000,
        retry: 1,
    });

    const { data: recentBookings, isLoading: bookingsLoading } = useQuery({
        queryKey: ["adminRecentBookings"],
        queryFn: getAdminRecentBookings,
        staleTime: 30 * 1000,
        retry: 1,
    });

    const { data: pendingQuotes, isLoading: quotesLoading } = useQuery({
        queryKey: ["adminPendingQuotes"],
        queryFn: getAdminPendingQuotes,
        staleTime: 30 * 1000,
        retry: 1,
    });

    const stats: AdminDashboardStats = statsData || {
        totalBookings: 0,
        pendingQuotes: 0,
        confirmedBookings: 0,
        inProgressBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalCustomers: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        averageBookingValue: 0,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This month</option>
                        <option>This year</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            {statsLoading ? (
                <AdminStatsOverviewSkeleton />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Revenue"
                            value={formatPrice(stats.totalRevenue)}
                            icon={DollarSign}
                            iconColor="text-green-600"
                            iconBg="bg-green-100"
                        />
                        <StatCard
                            title="Pending Quotes"
                            value={stats.pendingQuotes}
                            icon={Clock}
                            iconColor="text-orange-600"
                            iconBg="bg-orange-100"
                            alert={stats.pendingQuotes > 0}
                        />
                        <StatCard
                            title="Active Bookings"
                            value={stats.inProgressBookings + stats.confirmedBookings}
                            icon={Package}
                            iconColor="text-blue-600"
                            iconBg="bg-blue-100"
                        />
                        <StatCard
                            title="Completed"
                            value={stats.completedBookings}
                            icon={TrendingUp}
                            iconColor="text-purple-600"
                            iconBg="bg-purple-100"
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-blue-100">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-sm text-gray-500">Total Customers</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-green-100">
                                    <Truck className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm text-gray-500">Active Drivers</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeDrivers} / {stats.totalDrivers}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 rounded-xl bg-yellow-100">
                                    <Star className="w-5 h-5 text-yellow-600" />
                                </div>
                                <span className="text-sm text-gray-500">Avg Booking Value</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.averageBookingValue)}</p>
                        </div>
                    </div>
                </>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                {bookingsLoading ? (
                    <div className="lg:col-span-2">
                        <AdminBookingTableSkeleton />
                    </div>
                ) : (
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
                                <p className="text-sm text-gray-500">Latest booking requests</p>
                            </div>
                            <Link
                                href="/admin/bookings"
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                View all
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {(recentBookings || []).slice(0, 5).map((booking) => (
                                <div key={booking.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                                                {booking.user?.name?.charAt(0) || "G"}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.user?.name || "Guest"}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span className="truncate max-w-40">{booking.fromAddress.split(",")[0]}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span className="truncate max-w-40">{booking.toAddress.split(",")[0]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="font-semibold text-gray-900">{formatPrice(booking.price)}</p>
                                                <p className="text-xs text-gray-500">{formatDate(booking.moveDate)}</p>
                                            </div>
                                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                                                {booking.status.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!recentBookings || recentBookings.length === 0) && (
                                <div className="px-5 py-12 text-center text-gray-500">
                                    <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p>No bookings yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pending Quotes */}
                {quotesLoading ? (
                    <PendingQuotesSkeleton />
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <div>
                                <h3 className="font-semibold text-gray-900">Pending Quotes</h3>
                                <p className="text-sm text-gray-500">{(pendingQuotes || []).length} awaiting response</p>
                            </div>
                            <Link
                                href="/admin/bookings?status=REQUESTED"
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {(pendingQuotes || []).map((quote) => (
                                <div key={quote.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-900 text-sm">{quote.user?.name || "Guest"}</p>
                                        <span className="text-xs text-gray-400">{formatDate(quote.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        {getHouseSizeLabel(quote.houseSize)} • {quote.distanceKm} km
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-900">{formatPrice(quote.price)}</span>
                                        <Link href={`/admin/bookings?id=${quote.id}`} className="text-xs font-medium text-primary hover:underline">
                                            Review
                                        </Link>
                                    </div>
                                </div>
                            ))}
                            {(!pendingQuotes || pendingQuotes.length === 0) && (
                                <div className="px-5 py-8 text-center text-gray-500">
                                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">No pending quotes</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    alert?: boolean;
}

function StatCard({ title, value, change, icon: Icon, iconColor, iconBg, alert }: StatCardProps) {
    const isPositive = change && change > 0;

    return (
        <div className={`bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-md ${alert ? "border-orange-200 bg-orange-50/50" : "border-gray-100"
            }`}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
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
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBg}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
