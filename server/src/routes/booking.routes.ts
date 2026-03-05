import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    getAllQuotes,
    updateBookingStatus,
    assignDriver,
} from "../controller/booking.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

/** Allow max 10 quote submissions per IP per 15 minutes */
const quoteRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,
    message: { success: false, message: "Too many booking requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER routes
// ─────────────────────────────────────────────────────────────────────────────

// POST /bookings – create a booking / quote request
// Public: guests can submit, logged-in users get their userId attached automatically.
// Rate-limited to 10 requests per IP per 15 minutes to prevent spam.
router.post(
    "/",
    quoteRateLimiter,
    optionalAuth,
    createBooking
);

// GET /bookings/my – get current user's bookings
router.get(
    "/my",
    authenticateToken(Role.CUSTOMER, Role.ADMIN),
    getMyBookings
);

// PATCH /bookings/:id/cancel – cancel own booking
router.patch(
    "/:id/cancel",
    authenticateToken(Role.CUSTOMER, Role.ADMIN),
    cancelBooking
);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN routes
// ─────────────────────────────────────────────────────────────────────────────

// GET /bookings/quotes – all pending quote requests (status = REQUESTED)
router.get(
    "/quotes",
    authenticateToken(Role.ADMIN),
    getAllQuotes
);

// GET /bookings – all bookings with optional filters
router.get(
    "/",
    authenticateToken(Role.ADMIN),
    getAllBookings
);

// PATCH /bookings/:id/status – update booking status
router.patch(
    "/:id/status",
    authenticateToken(Role.ADMIN),
    updateBookingStatus
);

// PATCH /bookings/:id/assign-driver – assign a driver to a booking
router.patch(
    "/:id/assign-driver",
    authenticateToken(Role.ADMIN),
    assignDriver
);

// ─────────────────────────────────────────────────────────────────────────────
// SHARED (customer + admin)
// ─────────────────────────────────────────────────────────────────────────────

// GET /bookings/:id – get a single booking by ID
router.get(
    "/:id",
    authenticateToken(Role.CUSTOMER, Role.ADMIN, Role.DRIVER),
    getBookingById
);

export default router;
