import { Response } from "express";
import { prisma } from "../config/db";
import asyncHandler from "../lib/asyncHandler";
import successMsG from "../lib/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import { BookingStatus } from "../generated/prisma";

// ─────────────────────────────────────────────────────────────────────────────
// USER DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────

export interface UserDashboardStats {
    totalBookings: number;
    completedBookings: number;
    upcomingBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    recentActivity: number; // bookings in last 30 days
}

/**
 * GET /dashboard/stats
 * Get dashboard statistics for the authenticated user
 */
export const getUserDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
        totalBookings,
        completedBookings,
        upcomingBookings,
        cancelledBookings,
        totalSpentResult,
        recentActivity,
    ] = await prisma.$transaction([
        // Total bookings
        prisma.booking.count({ where: { userId } }),
        // Completed bookings
        prisma.booking.count({ where: { userId, status: BookingStatus.COMPLETED } }),
        // Upcoming bookings (confirmed, assigned, or in transit with future date)
        prisma.booking.count({
            where: {
                userId,
                status: { in: [BookingStatus.CONFIRMED, BookingStatus.ASSIGNED, BookingStatus.IN_TRANSIT] },
                moveDate: { gte: new Date() },
            },
        }),
        // Cancelled bookings
        prisma.booking.count({ where: { userId, status: BookingStatus.CANCELLED } }),
        // Total spent (sum of completed booking prices)
        prisma.booking.aggregate({
            where: { userId, status: BookingStatus.COMPLETED },
            _sum: { price: true },
        }),
        // Recent activity (bookings in last 30 days)
        prisma.booking.count({
            where: { userId, createdAt: { gte: thirtyDaysAgo } },
        }),
    ]);

    const stats: UserDashboardStats = {
        totalBookings,
        completedBookings,
        upcomingBookings,
        cancelledBookings,
        totalSpent: totalSpentResult._sum.price || 0,
        recentActivity,
    };

    return successMsG(200, stats, res);
});

/**
 * GET /dashboard/recent-bookings
 * Get user's recent bookings (last 5)
 */
export const getRecentBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return successMsG(200, bookings, res);
});

/**
 * GET /dashboard/upcoming-moves
 * Get user's upcoming moves (next 3 confirmed/assigned bookings)
 */
export const getUpcomingMoves = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const bookings = await prisma.booking.findMany({
        where: {
            userId,
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.ASSIGNED, BookingStatus.IN_TRANSIT] },
            moveDate: { gte: new Date() },
        },
        include: {
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
        orderBy: { moveDate: "asc" },
        take: 3,
    });

    return successMsG(200, bookings, res);
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD STATS
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
    totalBookings: number;
    pendingQuotes: number;
    confirmedBookings: number;
    inProgressBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalCustomers: number;
    totalDrivers: number;
    activeDrivers: number;
    averageBookingValue: number;
}

/**
 * GET /dashboard/admin/stats
 * Get dashboard statistics for admin users
 */
export const getAdminDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
        totalBookings,
        pendingQuotes,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalRevenueResult,
        monthlyRevenueResult,
        totalCustomers,
        totalDrivers,
        activeDrivers,
    ] = await prisma.$transaction([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: BookingStatus.REQUESTED } }),
        prisma.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        prisma.booking.count({ where: { status: { in: [BookingStatus.ASSIGNED, BookingStatus.IN_TRANSIT] } } }),
        prisma.booking.count({ where: { status: BookingStatus.COMPLETED } }),
        prisma.booking.count({ where: { status: BookingStatus.CANCELLED } }),
        prisma.booking.aggregate({
            where: { status: BookingStatus.COMPLETED },
            _sum: { price: true },
        }),
        prisma.booking.aggregate({
            where: {
                status: BookingStatus.COMPLETED,
                createdAt: { gte: startOfMonth },
            },
            _sum: { price: true },
        }),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.driver.count(),
        prisma.driver.count({ where: { isAvailable: true } }),
    ]);

    const totalRevenue = totalRevenueResult._sum.price || 0;
    const stats: AdminDashboardStats = {
        totalBookings,
        pendingQuotes,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
        monthlyRevenue: monthlyRevenueResult._sum.price || 0,
        totalCustomers,
        totalDrivers,
        activeDrivers,
        averageBookingValue: completedBookings > 0 ? totalRevenue / completedBookings : 0,
    };

    return successMsG(200, stats, res);
});

/**
 * GET /dashboard/admin/recent-bookings
 * Get recent bookings for admin (last 10)
 */
export const getAdminRecentBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookings = await prisma.booking.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    return successMsG(200, bookings, res);
});

/**
 * GET /dashboard/admin/pending-quotes
 * Get pending quote requests (last 5)
 */
export const getAdminPendingQuotes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const quotes = await prisma.booking.findMany({
        where: { status: BookingStatus.REQUESTED },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return successMsG(200, quotes, res);
});

/**
 * GET /dashboard/admin/bookings
 * Get all bookings for admin (with pagination support)
 */
export const getAdminAllBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookings = await prisma.booking.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return successMsG(200, bookings, res);
});
