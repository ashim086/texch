import { Request, Response, NextFunction } from "express";
import { decode } from "../lib/token";
import { Role } from "../generated/prisma";
import { AuthRequest } from "./auth.middleware";

/**
 * Soft authentication middleware.
 * - If a valid access token is present in cookies → attaches `req.user` (same as authenticateToken).
 * - If no token / invalid token → continues without setting `req.user` (guest request).
 *
 * Use this on routes that are publicly accessible but benefit from knowing who the caller is.
 */
export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
        const { accessToken } = req.cookies;

        if (accessToken) {
            const decoded = decode(accessToken);
            req.user = {
                id: decoded.id as number,
                email: decoded.email as string,
                name: decoded.name as string,
                role: decoded.role as Role,
            };
        }
    } catch {
        // Token missing, expired, or invalid — treat as guest, just continue
    }

    next();
};
