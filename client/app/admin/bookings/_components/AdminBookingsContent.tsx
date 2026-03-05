"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Truck,
    User,
    MapPin,
    Calendar,
    Phone,
    Mail,
    Loader2,
    Play,
    CheckCircle2,
} from "lucide-react";
import { BookingStatus, Booking, HouseSize, updateBookingStatus } from "@/api/bookingApi";
import { getAdminAllBookings } from "@/api/dashboardApi";
import { AdminBookingTableSkeleton } from "@/components/ui/skeleton";

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

export function AdminBookingsContent() {
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "ALL">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const queryClient = useQueryClient();

    const { data: bookings, isLoading } = useQuery({
        queryKey: ["adminAllBookings"],
        queryFn: getAdminAllBookings,
        staleTime: 30 * 1000,
        retry: 1,
    });

    // Mutation for updating booking status
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: BookingStatus }) =>
            updateBookingStatus(id, status),
        onSuccess: () => {
            // Close modal after status update
            setSelectedBooking(null);
            // Admin side invalidations
            queryClient.invalidateQueries({ queryKey: ["adminAllBookings"] });
            queryClient.invalidateQueries({ queryKey: ["adminStats"] });
            queryClient.invalidateQueries({ queryKey: ["adminRecentBookings"] });
            // User side invalidations (so user's dashboard/bookings page reflects changes)
            queryClient.invalidateQueries({ queryKey: ["userStats"] });
            queryClient.invalidateQueries({ queryKey: ["userDashboardStats"] });
            queryClient.invalidateQueries({ queryKey: ["recentBookings"] });
            queryClient.invalidateQueries({ queryKey: ["userBookings"] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });

    const handleConfirmBooking = (bookingId: string) => {
        statusMutation.mutate({ id: bookingId, status: "CONFIRMED" });
    };

    const handleCancelBooking = (bookingId: string) => {
        statusMutation.mutate({ id: bookingId, status: "CANCELLED" });
    };

    const handleStartTransit = (bookingId: string) => {
        statusMutation.mutate({ id: bookingId, status: "IN_TRANSIT" });
    };

    const handleMarkCompleted = (bookingId: string) => {
        statusMutation.mutate({ id: bookingId, status: "COMPLETED" });
    };

    const filteredBookings = useMemo(() => {
        if (!bookings) return [];
        return bookings.filter((booking) => {
            const matchesStatus = selectedStatus === "ALL" || booking.status === selectedStatus;
            const matchesSearch =
                booking.fromAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.toAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [bookings, selectedStatus, searchQuery]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
                    <p className="text-gray-500">Manage and track all customer bookings</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, address, or booking ID..."
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
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <AdminBookingTableSkeleton rows={10} />
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {booking.user?.name?.charAt(0) || "G"}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">
                                                        {booking.user?.name || "Guest"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{booking.user?.email || booking.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm">
                                                <p className="text-gray-900 truncate max-w-32">{booking.fromAddress.split(",")[0]}</p>
                                                <p className="text-gray-500 truncate max-w-32">→ {booking.toAddress.split(",")[0]}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-900">{formatDate(booking.moveDate)}</p>
                                            <p className="text-xs text-gray-500">{formatTime(booking.moveDate)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="text-sm text-gray-900">{getHouseSizeLabel(booking.houseSize)}</p>
                                            <p className="text-xs text-gray-500">{booking.distanceKm} km</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                                                {booking.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-semibold text-gray-900">{formatPrice(booking.price)}</p>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                                    title="View details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {booking.status === "REQUESTED" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleConfirmBooking(booking.id)}
                                                            disabled={statusMutation.isPending}
                                                            className="p-2 rounded-lg hover:bg-green-100 text-green-600 disabled:opacity-50"
                                                            title="Confirm"
                                                        >
                                                            {statusMutation.isPending && statusMutation.variables?.id === booking.id && statusMutation.variables?.status === "CONFIRMED" ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <CheckCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            disabled={statusMutation.isPending}
                                                            className="p-2 rounded-lg hover:bg-red-100 text-red-600 disabled:opacity-50"
                                                            title="Cancel"
                                                        >
                                                            {statusMutation.isPending && statusMutation.variables?.id === booking.id && statusMutation.variables?.status === "CANCELLED" ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                                {(booking.status === "CONFIRMED" || booking.status === "REQUESTED") && (
                                                    <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-600" title="Assign driver">
                                                        <Truck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {booking.status === "ASSIGNED" && (
                                                    <button
                                                        onClick={() => handleStartTransit(booking.id)}
                                                        disabled={statusMutation.isPending}
                                                        className="p-2 rounded-lg hover:bg-orange-100 text-orange-600 disabled:opacity-50"
                                                        title="Start Transit"
                                                    >
                                                        {statusMutation.isPending && statusMutation.variables?.id === booking.id && statusMutation.variables?.status === "IN_TRANSIT" ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Play className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                                {(booking.status === "CONFIRMED" || booking.status === "ASSIGNED" || booking.status === "IN_TRANSIT") && (
                                                    <button
                                                        onClick={() => handleMarkCompleted(booking.id)}
                                                        disabled={statusMutation.isPending}
                                                        className="p-2 rounded-lg hover:bg-green-100 text-green-600 disabled:opacity-50"
                                                        title="Mark Completed"
                                                    >
                                                        {statusMutation.isPending && statusMutation.variables?.id === booking.id && statusMutation.variables?.status === "COMPLETED" ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="p-12 text-center">
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Booking Details Modal */}
            {selectedBooking && (
                <BookingDetailsModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelBooking}
                    onStartTransit={handleStartTransit}
                    onMarkCompleted={handleMarkCompleted}
                    isPending={statusMutation.isPending}
                    pendingBookingId={statusMutation.variables?.id}
                    pendingStatus={statusMutation.variables?.status}
                />
            )}
        </div>
    );
}

interface BookingDetailsModalProps {
    booking: Booking;
    onClose: () => void;
    onConfirm: (id: string) => void;
    onCancel: (id: string) => void;
    onStartTransit: (id: string) => void;
    onMarkCompleted: (id: string) => void;
    isPending: boolean;
    pendingBookingId?: string;
    pendingStatus?: BookingStatus;
}

function BookingDetailsModal({ booking, onClose, onConfirm, onCancel, onStartTransit, onMarkCompleted, isPending, pendingBookingId, pendingStatus }: BookingDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                        <p className="text-sm text-gray-500">#{booking.id.slice(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                        <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status.replace("_", " ")}
                        </span>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(booking.price)}</span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium">{booking.user?.name || "Guest"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium">{booking.user?.email || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="font-medium">{booking.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Property Type</p>
                                <p className="font-medium">{getHouseSizeLabel(booking.houseSize)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Route Info */}
                    <div className="space-y-3">
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Route Details
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-1">Pickup</p>
                            <p className="text-sm font-medium text-gray-900">{booking.fromAddress}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 mb-1">Destination</p>
                            <p className="text-sm font-medium text-gray-900">{booking.toAddress}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500">Distance: <span className="font-medium text-gray-900">{booking.distanceKm} km</span></span>
                            <span className="text-gray-500">Move Date: <span className="font-medium text-gray-900">{formatDate(booking.moveDate)}</span></span>
                        </div>
                    </div>

                    {/* Driver Info */}
                    {booking.driver && (
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-emerald-600" />
                                Assigned Driver
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-emerald-600 flex items-center justify-center">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{booking.driver.user.name}</p>
                                    <p className="text-sm text-gray-500">{booking.driver.vehicleType}</p>
                                </div>
                                {booking.driver.user.phone && (
                                    <a href={`tel:${booking.driver.user.phone}`} className="ml-auto p-2 rounded-lg bg-emerald-100 text-emerald-600">
                                        <Phone className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-100 flex gap-3">
                    {booking.status === "REQUESTED" && (
                        <>
                            <button
                                onClick={() => onConfirm(booking.id)}
                                disabled={isPending && pendingBookingId === booking.id}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending && pendingBookingId === booking.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Confirm Booking
                            </button>
                            <button
                                onClick={() => onCancel(booking.id)}
                                disabled={isPending && pendingBookingId === booking.id}
                                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending && pendingBookingId === booking.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <XCircle className="w-4 h-4" />
                                )}
                                Decline
                            </button>
                        </>
                    )}
                    {booking.status === "CONFIRMED" && (
                        <>
                            <button className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                <Truck className="w-4 h-4" />
                                Assign Driver
                            </button>
                            <button
                                onClick={() => onMarkCompleted(booking.id)}
                                disabled={isPending && pendingBookingId === booking.id}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending && pendingBookingId === booking.id && pendingStatus === "COMPLETED" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                                Mark Completed
                            </button>
                        </>
                    )}
                    {booking.status === "ASSIGNED" && (
                        <>
                            <button
                                onClick={() => onStartTransit(booking.id)}
                                disabled={isPending && pendingBookingId === booking.id}
                                className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending && pendingBookingId === booking.id && pendingStatus === "IN_TRANSIT" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                Start Transit
                            </button>
                            <button
                                onClick={() => onMarkCompleted(booking.id)}
                                disabled={isPending && pendingBookingId === booking.id}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPending && pendingBookingId === booking.id && pendingStatus === "COMPLETED" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                                Mark Completed
                            </button>
                        </>
                    )}
                    {booking.status === "IN_TRANSIT" && (
                        <button
                            onClick={() => onMarkCompleted(booking.id)}
                            disabled={isPending && pendingBookingId === booking.id}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending && pendingBookingId === booking.id && pendingStatus === "COMPLETED" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            Mark Completed
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
