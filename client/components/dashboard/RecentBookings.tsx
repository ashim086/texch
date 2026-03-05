"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    MapPin,
    Calendar,
    ArrowRight,
    MoreHorizontal,
    Truck
} from "lucide-react";
import { Booking, BookingStatus, HouseSize } from "@/api/bookingApi";
import { getRecentBookings } from "@/api/dashboardApi";
import { RecentBookingsSkeleton } from "@/components/ui/skeleton";

interface RecentBookingsProps {
    limit?: number;
}

// Helper functions
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

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
}

export function RecentBookings({ limit = 3 }: RecentBookingsProps) {
    const { data: bookings, isLoading, error } = useQuery({
        queryKey: ["recentBookings"],
        queryFn: getRecentBookings,
        staleTime: 30 * 1000,
        retry: 1,
    });

    if (isLoading) {
        return <RecentBookingsSkeleton />;
    }

    const displayBookings = (bookings || []).slice(0, limit);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
                    <p className="text-sm text-gray-500">Your latest moving requests</p>
                </div>
                <Link
                    href="/dashboard/bookings"
                    className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Bookings List */}
            <div className="divide-y divide-gray-100">
                {displayBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                ))}
            </div>

            {displayBookings.length === 0 && (
                <div className="px-5 py-12 text-center">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No bookings yet</p>
                    <Link href="/" className="text-sm text-primary font-medium hover:underline">
                        Book your first move
                    </Link>
                </div>
            )}
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking }) {
    return (
        <div className="px-5 py-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-start justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1 min-w-0 space-y-3">
                    {/* Route */}
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 pt-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <div className="w-0.5 h-6 bg-gray-200" />
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                        </div>
                        <div className="flex-1 space-y-3">
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">From</p>
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {booking.fromAddress}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">To</p>
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {booking.toAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{formatDate(booking.moveDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{booking.distanceKm} km</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span>{getHouseSizeLabel(booking.houseSize)}</span>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace("_", " ")}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(booking.price)}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
