"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    ArrowRight,
    Truck
} from "lucide-react";
import { Booking, HouseSize } from "@/api/bookingApi";
import { getUpcomingMoves } from "@/api/dashboardApi";
import { UpcomingMovesSkeleton } from "@/components/ui/skeleton";

// Helper functions
function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
    });
}

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 0,
    }).format(amount);
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

export function UpcomingMoves() {
    const { data: upcomingBookings, isLoading, error } = useQuery({
        queryKey: ["upcomingMoves"],
        queryFn: getUpcomingMoves,
        staleTime: 30 * 1000,
        retry: 1,
    });

    if (isLoading) {
        return <UpcomingMovesSkeleton />;
    }

    const bookings = upcomingBookings || [];

    return (
        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-2xl border border-primary/10 p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Upcoming Moves</h3>
                        <p className="text-xs text-gray-500">{bookings.length} scheduled</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {bookings.map((booking, index) => (
                    <UpcomingMoveCard key={booking.id} booking={booking} isNext={index === 0} />
                ))}

                {bookings.length === 0 && (
                    <div className="text-center py-8">
                        <Truck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No upcoming moves</p>
                        <Link href="/" className="text-sm text-primary font-medium hover:underline">
                            Book a move
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function UpcomingMoveCard({ booking, isNext }: { booking: Booking; isNext: boolean }) {
    const moveDate = new Date(booking.moveDate);
    const daysUntil = Math.ceil((moveDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    return (
        <div className={`bg-white rounded-xl p-4 border ${isNext ? 'border-primary/30 shadow-sm' : 'border-gray-100'}`}>
            {isNext && (
                <div className="flex items-center gap-1 text-xs text-primary font-medium mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Next Move • {daysUntil > 0 ? `in ${daysUntil} days` : 'Today!'}
                </div>
            )}

            {/* Date & Time */}
            <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{formatDate(booking.moveDate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{formatTime(booking.moveDate)}</span>
                </div>
            </div>

            {/* Route Preview */}
            <div className="flex items-center gap-2 text-sm mb-3">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span className="text-gray-600 truncate">{booking.fromAddress.split(",")[0]}</span>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="text-gray-600 truncate">{booking.toAddress.split(",")[0]}</span>
            </div>

            {/* Driver Info (if assigned) */}
            {booking.driver && (
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{booking.driver.user.name}</p>
                        <p className="text-xs text-gray-500">{booking.driver.vehicleType}</p>
                    </div>
                    {booking.driver.user.phone && (
                        <a
                            href={`tel:${booking.driver.user.phone}`}
                            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                </div>
            )}

            {/* Price & Size */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">{getHouseSizeLabel(booking.houseSize)} • {booking.distanceKm} km</span>
                <span className="font-semibold text-gray-900">{formatPrice(booking.price)}</span>
            </div>
        </div>
    );
}
