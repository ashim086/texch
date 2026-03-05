"use client";

import { cn } from "@/lib/utils";

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-gray-200",
                className
            )}
        />
    );
}

// ─── Stats Card Skeleton ──────────────────────────────────────────────────────

export function StatsCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-16 h-5 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

export function StatsOverviewSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>
    );
}

// ─── Booking Card Skeleton ────────────────────────────────────────────────────

export function BookingCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="w-20 h-6 rounded-full" />
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded" />
                    <Skeleton className="h-3 w-48" />
                </div>
            </div>
        </div>
    );
}

export function RecentBookingsSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <BookingCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// ─── Service Card Skeleton ────────────────────────────────────────────────────

export function ServiceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4 mb-4" />
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ServiceHighlightsSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// ─── Upcoming Moves Skeleton ──────────────────────────────────────────────────

export function UpcomingMoveCardSkeleton() {
    return (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-40" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}

export function UpcomingMovesSkeleton() {
    return (
        <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-2xl border border-primary/10 p-5">
            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-xl bg-primary/20" />
                <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
            <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                    <UpcomingMoveCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// ─── Quick Actions Skeleton ───────────────────────────────────────────────────

export function QuickActionsSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// ─── Welcome Section Skeleton ─────────────────────────────────────────────────

export function WelcomeSkeleton() {
    return (
        <div className="bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-primary/10">
            <div className="flex flex-col lg:flex-row items-center gap-6">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="text-center lg:text-left flex-1">
                    <Skeleton className="h-8 w-64 mb-2 mx-auto lg:mx-0" />
                    <Skeleton className="h-4 w-80 mx-auto lg:mx-0" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        </div>
    );
}

// ─── Admin Dashboard Skeletons ────────────────────────────────────────────────

export function AdminStatsOverviewSkeleton() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
                <StatsCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function AdminBookingTableRowSkeleton() {
    return (
        <tr className="border-b border-gray-100">
            <td className="p-4"><Skeleton className="h-4 w-20" /></td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </td>
            <td className="p-4"><Skeleton className="h-3 w-40" /></td>
            <td className="p-4"><Skeleton className="h-3 w-24" /></td>
            <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
            <td className="p-4"><Skeleton className="h-4 w-16" /></td>
            <td className="p-4"><Skeleton className="h-8 w-8 rounded-lg" /></td>
        </tr>
    );
}

export function AdminBookingTableSkeleton({ rows = 5 }: { rows?: number } = {}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <Skeleton className="h-6 w-40" />
            </div>
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-8" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-20" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-12" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-14" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-12" /></th>
                        <th className="p-4 text-left"><Skeleton className="h-4 w-16" /></th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(rows)].map((_, i) => (
                        <AdminBookingTableRowSkeleton key={i} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function PendingQuotesSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-48 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Bookings Page Skeletons ──────────────────────────────────────────────────

export function BookingsFilterSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <Skeleton className="h-10 flex-1 rounded-xl" />
                <div className="flex gap-2 overflow-x-auto">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full shrink-0" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function BookingsGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <BookingCardSkeleton key={i} />
            ))}
        </div>
    );
}

// ─── Services Page Skeletons ──────────────────────────────────────────────────

export function ServicesPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-primary/10">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
