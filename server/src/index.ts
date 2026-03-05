import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { dbConnection } from "./config/db";
import globalError from "./middlewares/global_error_handler";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookingRoutes from "./routes/booking.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import serviceRoutes from "./routes/service.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - IMPORTANT for authentication with cookies
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true, // Allow cookies
}));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: `Server running with ENV ${process.env.NODE_ENV}` });
});

// API v1 Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/services", serviceRoutes);

// Start server
app.listen(PORT, async () => {
    await dbConnection();
    console.log(`Server running on http://localhost:${PORT}`);
});

// Global error handler - MUST be after all routes
app.use(globalError);