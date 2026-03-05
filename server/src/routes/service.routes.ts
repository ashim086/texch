import { Router } from "express";
import {
    getAllServices,
    getServiceById,
    getAllServicesAdmin,
    createService,
    updateService,
    deleteService,
} from "../controller/service.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /services - get all active services (public)
router.get("/", getAllServices);

// GET /services/:id - get single service by ID
router.get("/:id", getServiceById);

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /services/admin/all - get all services including inactive
router.get(
    "/admin/all",
    authenticateToken(Role.ADMIN),
    getAllServicesAdmin
);

// POST /services - create new service
router.post(
    "/",
    authenticateToken(Role.ADMIN),
    createService
);

// PUT /services/:id - update service
router.put(
    "/:id",
    authenticateToken(Role.ADMIN),
    updateService
);

// DELETE /services/:id - delete service
router.delete(
    "/:id",
    authenticateToken(Role.ADMIN),
    deleteService
);

export default router;
