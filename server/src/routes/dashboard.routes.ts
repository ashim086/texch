import { Router } from "express";
import {
    getUserDashboardStats,
    getRecentBookings,
    getUpcomingMoves,
    getAdminDashboardStats,
    getAdminRecentBookings,
    getAdminPendingQuotes,
    getAdminAllBookings,
} from "../controller/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// USER DASHBOARD ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /dashboard/stats - get user dashboard stats
router.get(
    "/stats",
    authenticateToken(Role.CUSTOMER, Role.ADMIN),
    getUserDashboardStats
);

// GET /dashboard/recent-bookings - get recent bookings
router.get(
    "/recent-bookings",
    authenticateToken(Role.CUSTOMER, Role.ADMIN),
    getRecentBookings
);

// GET /dashboard/upcoming-moves - get upcoming moves
router.get(
    "/upcoming-moves",
    authenticateToken(Role.CUSTOMER, Role.ADMIN),
    getUpcomingMoves
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /dashboard/admin/stats - get admin dashboard stats
router.get(
    "/admin/stats",
    authenticateToken(Role.ADMIN),
    getAdminDashboardStats
);

// GET /dashboard/admin/recent-bookings - get recent bookings (admin)
router.get(
    "/admin/recent-bookings",
    authenticateToken(Role.ADMIN),
    getAdminRecentBookings
);

// GET /dashboard/admin/pending-quotes - get pending quotes (admin)
router.get(
    "/admin/pending-quotes",
    authenticateToken(Role.ADMIN),
    getAdminPendingQuotes
);

// GET /dashboard/admin/bookings - get all bookings (admin)
router.get(
    "/admin/bookings",
    authenticateToken(Role.ADMIN),
    getAdminAllBookings
);

export default router;
