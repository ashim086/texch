import { Request, Response, NextFunction } from "express";
import { decode } from "../lib/token";
import customError from "../lib/customError";
import { Role } from "../generated/prisma";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        name: string;
        role: Role
    };
}

export const authenticateToken = (...allowedRoles: Role[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { accessToken } = req.cookies;

            if (!accessToken) {
                throw new customError(401, "Access token not found");
            }

            // Verify and decode token
            const decoded = decode(accessToken);

            // Attach user info to request
            req.user = {
                id: decoded.id as number,
                email: decoded.email as string,
                name: decoded.name as string,
                role: decoded.role as Role,
            };

            // Check if user has required role
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ 
                    message: "Forbidden: Insufficient permissions" 
                });
            }

            next();
        } catch (error: any) {
            // Token expired or invalid
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ message: "Invalid token" });
            }
            next(error);
        }
    };
};
