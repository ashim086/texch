import { Router } from "express";
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser
} from "../controller/user.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Role } from "../generated/prisma";

const router = Router();

// GET /users - Get all users (protected)
router.get("/", authenticateToken(Role.ADMIN), getAllUsers);

// POST /users - Create a new user
router.post("/", createUser);

// GET /users/:id - Get user by ID (protected)
router.get("/:id", authenticateToken(Role.ADMIN), getUserById);

// PATCH /users/:id - Update user by ID (protected)
router.patch("/:id", authenticateToken(Role.ADMIN), updateUser);

// DELETE /users/:id - Delete user by ID (protected)
router.delete("/:id", authenticateToken(Role.ADMIN), deleteUser);

export default router;
