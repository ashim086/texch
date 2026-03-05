import { Response } from "express";
import { prisma } from "../config/db";
import asyncHandler from "../lib/asyncHandler";
import customError from "../lib/customError";
import successMsG from "../lib/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";
import { BookingStatus, HouseSize, Prisma } from "../generated/prisma";

// CUSTOMER ENDPOINTS

/**
 * POST /bookings
 * Create a new booking / quote request. Accessible by authenticated customers.
 */
export const createBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { fromAddress, toAddress, distanceKm, moveDate, houseSize, phone, price } = req.body;

    if (!fromAddress || !toAddress || !distanceKm || !moveDate || !houseSize || !phone || price === undefined) {
        throw new customError(400, "All fields are required: fromAddress, toAddress, distanceKm, moveDate, houseSize, phone, price");
    }

    if (!Object.values(HouseSize).includes(houseSize)) {
        throw new customError(400, `Invalid houseSize. Must be one of: ${Object.values(HouseSize).join(", ")}`);
    }

    const booking = await prisma.booking.create({
        data: {
            fromAddress,
            toAddress,
            distanceKm: Number(distanceKm),
            moveDate: new Date(moveDate),
            houseSize: houseSize as HouseSize,
            phone,
            price: Number(price),
            userId: req.user?.id ?? null,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    });

    return successMsG(201, booking, res, "Booking request submitted successfully");
});

/**
 * GET /bookings/my
 * Get all bookings belonging to the currently authenticated customer.
 */
export const getMyBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const bookings = await prisma.booking.findMany({
        where: { userId: req.user!.id },
        include: {
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return successMsG(200, bookings, res);
});

/**
 * GET /bookings/:id
 * Get a single booking by ID.
 * Customers can only fetch their own; admins can fetch any.
 */
export const getBookingById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
            driver: {
                include: { user: { select: { name: true, phone: true } } },
            },
        },
    });

    if (!booking) {
        throw new customError(404, "Booking not found");
    }

    // Customers can only view their own bookings
    if (req.user!.role === "CUSTOMER" && booking.userId !== req.user!.id) {
        throw new customError(403, "You are not authorised to view this booking");
    }

    return successMsG(200, booking, res);
});

/**
 * PATCH /bookings/:id/cancel
 * Cancel a booking. Only the owning customer (and admins) may cancel.
 * Only REQUESTED or CONFIRMED bookings can be cancelled.
 */
export const cancelBooking = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
        throw new customError(404, "Booking not found");
    }

    if (req.user!.role === "CUSTOMER" && booking.userId !== req.user!.id) {
        throw new customError(403, "You are not authorised to cancel this booking");
    }

    const cancellable: BookingStatus[] = [BookingStatus.REQUESTED, BookingStatus.CONFIRMED];
    if (!cancellable.includes(booking.status)) {
        throw new customError(400, "Only REQUESTED or CONFIRMED bookings can be cancelled");
    }

    const updated = await prisma.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
    });

    return successMsG(200, updated, res, "Booking cancelled");
});

// ADMIN ENDPOINTS

/**
 * GET /bookings
 * Get ALL bookings with optional filters.
 * Query params: status, houseSize, page (default 1), limit (default 20)
 */
export const getAllBookings = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, houseSize, page = "1", limit = "20" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.BookingWhereInput = {};
    if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
        where.status = status as BookingStatus;
    }
    if (houseSize && Object.values(HouseSize).includes(houseSize as HouseSize)) {
        where.houseSize = houseSize as HouseSize;
    }

    const [bookings, total] = await prisma.$transaction([
        prisma.booking.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                driver: {
                    include: { user: { select: { name: true, phone: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limitNum,
        }),
        prisma.booking.count({ where }),
    ]);

    return successMsG(200, { bookings, total, page: pageNum, limit: limitNum }, res);
});

/**
 * GET /bookings/quotes
 * Get all bookings with status REQUESTED (i.e. new quote requests).
 * Supports pagination: ?page=1&limit=20
 */
export const getAllQuotes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [quotes, total] = await prisma.$transaction([
        prisma.booking.findMany({
            where: { status: BookingStatus.REQUESTED },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limitNum,
        }),
        prisma.booking.count({ where: { status: BookingStatus.REQUESTED } }),
    ]);
    
    return successMsG(200, { quotes, total, page: pageNum, limit: limitNum }, res, "Pending quotes");
});

/**
 * PATCH /bookings/:id/status
 * Update the status of any booking.
 * Body: { status: BookingStatus }
 */
export const updateBookingStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
        throw new customError(400, `Invalid status. Valid values: ${Object.values(BookingStatus).join(", ")}`);
    }

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
        throw new customError(404, "Booking not found");
    }

    const updated = await prisma.booking.update({
        where: { id },
        data: { status: status as BookingStatus },
        include: {
            user: { select: { id: true, name: true, email: true } },
            driver: { include: { user: { select: { name: true, phone: true } } } },
        },
    });

    return successMsG(200, updated, res, "Booking status updated");
});

/**
 * PATCH /bookings/:id/assign-driver
 * Assign a driver to a booking and set status to ASSIGNED.
 * Body: { driverId: string }
 */
export const assignDriver = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { driverId } = req.body;

    if (!driverId) {
        throw new customError(400, "driverId is required");
    }

    const [booking, driver] = await Promise.all([
        prisma.booking.findUnique({ where: { id } }),
        prisma.driver.findUnique({ where: { id: driverId } }),
    ]);

    if (!booking) throw new customError(404, "Booking not found");
    if (!driver) throw new customError(404, "Driver not found");

    const notAssignable: BookingStatus[] = [BookingStatus.COMPLETED, BookingStatus.CANCELLED];
    if (notAssignable.includes(booking.status)) {
        throw new customError(400, "Cannot assign a driver to a COMPLETED or CANCELLED booking");
    }

    const updated = await prisma.booking.update({
        where: { id },
        data: {
            driverId,
            status: BookingStatus.ASSIGNED,
        },
        include: {
            user: { select: { id: true, name: true, email: true } },
            driver: { include: { user: { select: { name: true, phone: true } } } },
        },
    });

    return successMsG(200, updated, res, "Driver assigned successfully");
});
