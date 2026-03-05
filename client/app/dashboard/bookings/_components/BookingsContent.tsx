"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Calendar,
    Filter,
    Search,
    Plus,
    Phone,
    User,
    Truck,
    ChevronRight,
    X,
    AlertCircle,
} from "lucide-react";
import { BookingStatus, HouseSize, Booking } from "@/api/bookingApi";
import { getRecentBookings } from "@/api/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";

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
        year: "numeric",
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
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

const statusFilters: { label: string; value: BookingStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Requested", value: "REQUESTED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Assigned", value: "ASSIGNED" },
    { label: "In Transit", value: "IN_TRANSIT" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
];

function BookingCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <Skeleton className="h-6 w-20 rounded-full mb-1" />
                    <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
            <div className="flex items-start gap-3 mb-4">
                <div className="flex flex-col items-center gap-1 pt-1">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <div className="w-0.5 h-8 bg-gray-200" />
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <Skeleton className="h-3 w-10 mb-1" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div>
                        <Skeleton className="h-3 w-10 mb-1" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-5 w-5 rounded" />
            </div>
        </div>
    );
}

export function BookingsContent() {
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

    const { data: bookings, isLoading, isError, error } = useQuery({
        queryKey: ["userBookings"],
        queryFn: getRecentBookings,
        staleTime: 30 * 1000,
        retry: 1,
    });

    // Filter bookings
    const filteredBookings = useMemo(() => {
        if (!bookings) return [];
        return bookings.filter((booking) => {
            const matchesStatus = selectedStatus === "ALL" || booking.status === selectedStatus;
            const matchesSearch =
                booking.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.toAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [bookings, selectedStatus, searchQuery]);

    const activeBooking = filteredBookings.find(b => b.id === selectedBooking);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
                    <p className="text-gray-500">Manage and track all your moves</p>
                </div>
                <Link
                    href="/dashboard/services"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    New Booking
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by address or booking ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>

                    {/* Status Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <Filter className="w-5 h-5 text-gray-400 shrink-0" />
                        {statusFilters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setSelectedStatus(filter.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedStatus === filter.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Bookings List */}
                <div className={`${selectedBooking ? 'xl:col-span-2' : 'xl:col-span-3'} space-y-4`}>
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <BookingCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="bg-white rounded-2xl border border-red-100 p-12 text-center">
                            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load bookings</h3>
                            <p className="text-gray-500 mb-4">
                                {error instanceof Error ? error.message : "Something went wrong"}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <Truck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No bookings found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery ? "Try a different search term" : "You haven't made any bookings yet"}
                            </p>
                            <Link
                                href="/?book=true"
                                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                            >
                                <Plus className="w-4 h-4" />
                                Create your first booking
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                                    className={`bg-white rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${selectedBooking === booking.id
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-gray-100"
                                        }`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                                                {booking.status.replace("_", " ")}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">#{booking.id.slice(0, 8)}</p>
                                        </div>
                                        <span className="text-lg font-bold text-gray-900">{formatPrice(booking.price)}</span>
                                    </div>

                                    {/* Route */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="flex flex-col items-center gap-1 pt-1">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <div className="w-0.5 h-8 bg-gray-200" />
                                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-400">From</p>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {booking.fromAddress}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">To</p>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                    {booking.toAddress}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(booking.moveDate)}
                                            </span>
                                            <span>{getHouseSizeLabel(booking.houseSize)}</span>
                                        </div>
                                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedBooking === booking.id ? 'rotate-90' : ''}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Booking Details */}
                {selectedBooking && activeBooking && (
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Booking Details</h3>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <span className={`inline-flex px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusColor(activeBooking.status)}`}>
                                {activeBooking.status.replace("_", " ")}
                            </span>

                            {/* Route Details */}
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-1">Pickup</p>
                                    <p className="text-sm font-medium text-gray-900">{activeBooking.fromAddress}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 mb-1">Destination</p>
                                    <p className="text-sm font-medium text-gray-900">{activeBooking.toAddress}</p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Date</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDate(activeBooking.moveDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Time</p>
                                    <p className="text-sm font-medium text-gray-900">{formatTime(activeBooking.moveDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Distance</p>
                                    <p className="text-sm font-medium text-gray-900">{activeBooking.distanceKm} km</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Property</p>
                                    <p className="text-sm font-medium text-gray-900">{getHouseSizeLabel(activeBooking.houseSize)}</p>
                                </div>
                            </div>

                            {/* Driver Info */}
                            {activeBooking.driver && (
                                <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                    <p className="text-xs text-gray-500 mb-3">Assigned Driver</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activeBooking.driver.user.name}</p>
                                            <p className="text-xs text-gray-500">{activeBooking.driver.vehicleType}</p>
                                        </div>
                                        {activeBooking.driver.user.phone && (
                                            <a
                                                href={`tel:${activeBooking.driver.user.phone}`}
                                                className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div className="mt-6 p-4 bg-gray-900 rounded-xl text-white">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Total Price</span>
                                    <span className="text-2xl font-bold">{formatPrice(activeBooking.price)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            {activeBooking.status === "REQUESTED" && (
                                <button className="w-full mt-4 py-3 text-red-600 font-medium bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
