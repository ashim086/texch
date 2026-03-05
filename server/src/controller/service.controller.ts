import { Response } from "express";
import { prisma } from "../config/db";
import asyncHandler from "../lib/asyncHandler";
import customError from "../lib/customError";
import successMsG from "../lib/responseHandler";
import { AuthRequest } from "../middlewares/auth.middleware";

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /services
 * Get all active services (public)
 */
export const getAllServices = asyncHandler(async (req: AuthRequest, res: Response) => {
    const services = await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return successMsG(200, services, res);
});

/**
 * GET /services/:id
 * Get a single service by ID
 */
export const getServiceById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const service = await prisma.service.findUnique({
        where: { id },
    });

    if (!service) {
        throw new customError(404, "Service not found");
    }

    return successMsG(200, service, res);
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /services/admin/all
 * Get all services including inactive (admin only)
 */
export const getAllServicesAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "desc" },
    });

    return successMsG(200, services, res);
});

/**
 * POST /services
 * Create a new service (admin only)
 */
export const createService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, description, icon, basePrice, pricePerKm, features } = req.body;

    if (!name || !description || !icon || basePrice === undefined || pricePerKm === undefined) {
        throw new customError(400, "Required fields: name, description, icon, basePrice, pricePerKm");
    }

    const existingService = await prisma.service.findUnique({ where: { name } });
    if (existingService) {
        throw new customError(400, "Service with this name already exists");
    }

    const service = await prisma.service.create({
        data: {
            name,
            description,
            icon,
            basePrice: Number(basePrice),
            pricePerKm: Number(pricePerKm),
            features: features || [],
        },
    });

    return successMsG(201, service, res, "Service created successfully");
});

/**
 * PUT /services/:id
 * Update a service (admin only)
 */
export const updateService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;
    const { name, description, icon, basePrice, pricePerKm, features, isActive } = req.body;

    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
        throw new customError(404, "Service not found");
    }

    // Check for duplicate name (excluding current service)
    if (name && name !== existingService.name) {
        const duplicateName = await prisma.service.findUnique({ where: { name } });
        if (duplicateName) {
            throw new customError(400, "Service with this name already exists");
        }
    }

    const service = await prisma.service.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(description && { description }),
            ...(icon && { icon }),
            ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
            ...(pricePerKm !== undefined && { pricePerKm: Number(pricePerKm) }),
            ...(features && { features }),
            ...(isActive !== undefined && { isActive }),
        },
    });

    return successMsG(200, service, res, "Service updated successfully");
});

/**
 * DELETE /services/:id
 * Delete a service (admin only)
 */
export const deleteService = asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const existingService = await prisma.service.findUnique({ where: { id } });
    if (!existingService) {
        throw new customError(404, "Service not found");
    }

    await prisma.service.delete({ where: { id } });

    return successMsG(200, null, res, "Service deleted successfully");
});
